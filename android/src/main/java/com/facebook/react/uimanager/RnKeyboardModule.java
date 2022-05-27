package com.facebook.react.uimanager;

import android.app.Activity;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.views.modal.ReactModalHostView;
import com.facebook.react.views.textinput.BlurEvent;
import com.facebook.react.views.textinput.EndEditingEvent;
import com.facebook.react.views.textinput.FocusEvent;
import com.facebook.react.views.textinput.ReactEditText;
import com.facebook.react.views.view.ReactViewGroup;

import java.util.HashMap;

@ReactModule(name = RnKeyboardModule.NAME)
public class RnKeyboardModule extends ReactContextBaseJavaModule {
  /** @todo expose this one to RN Layer so dev can change it */
  private final int TAG_ID = 0xABCDABCD;

  private final static String keyboardType = "RnKeyboardGeneral";
  private RnKeyboardEventEmitter eventEmitter;
  private static final int HEIGHT = 216;
  public static final String NAME = "RnKeyboard";
  private HashMap<String, RelativeLayout> keyboardList = new HashMap<>();

  public RnKeyboardModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.eventEmitter = new RnKeyboardEventEmitter(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void init(int height, Promise promise) {
    UiThreadUtil.runOnUiThread(() -> {
      try {
        final Activity activity = getCurrentActivity();
        RelativeLayout layout = new RelativeLayout(activity);
        ReactRootView rootView = new ReactRootView(this.getReactApplicationContext());
        rootView.setBackgroundColor(Color.WHITE);

        Bundle bundle = new Bundle();

        rootView.startReactApplication(
          ((ReactApplication) activity.getApplication())
            .getReactNativeHost()
            .getReactInstanceManager(),
          RnKeyboardModule.NAME,
          bundle
        );

        final float scale = activity.getResources().getDisplayMetrics().density;
        RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(
          ViewGroup.LayoutParams.MATCH_PARENT,
          Math.round(height * scale)
        );
        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM, RelativeLayout.TRUE);
        layout.addView(rootView, layoutParams);

        this.keyboardList.put(RnKeyboardModule.keyboardType, layout);

        promise.resolve(null);
      } catch (Exception ex) {
        promise.reject(ex);
      }

    });
  }

  private View getViewById(int id) {
    UIViewOperationQueue uii = null;
    View view = null;

    Log.d("#getViewById: ", String.valueOf(id));

    uii = this.getReactApplicationContext()
      .getNativeModule( UIManagerModule.class )
      .getUIImplementation()
      .getUIViewOperationQueue();

    try {
      view = uii
        .getNativeViewHierarchyManager()
        .resolveView(id);
      Log.d("#view: ", String.valueOf(view));
    } catch (IllegalViewOperationException ex) {
      Log.e("#getViewById: ", ex.getMessage());
    }
    return view;
  }

  @RequiresApi(Build.VERSION_CODES.DONUT)
  @ReactMethod
  public void attach(
    final int inputId,
    final ReadableMap options,
    Promise promise
  ) {
    UiThreadUtil.runOnUiThread(() -> {
      try {
        final Activity activity = getCurrentActivity();
        final ReactEditText input = (ReactEditText) getViewById(inputId);

        if (input == null) { promise.reject("Error", "Cannot attach"); return; };

        View _keyboard = (View) this.keyboardList.get(RnKeyboardModule.keyboardType);
        input.setTag(TAG_ID, _keyboard);

        input.setOnFocusChangeListener((View currentView, boolean isFocused) -> {
          try {
            View keyboard = (View) input.getTag(TAG_ID);

            ReactContext context = UIManagerHelper.getReactContext(input);
            EventDispatcher inputEventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(context, input.getId());

            WritableMap keyboardEventInfo = Arguments.createMap();
            keyboardEventInfo.putInt("inputId", inputId);

            if (isFocused) {
              if (options != null) {
                ReadableMap modalInfo = options.getMap("modalInfo");

                if (modalInfo != null) {
                  int viewId = modalInfo.getInt("viewId");
                  int modalId = modalInfo.getInt("modalId");

                  if (keyboard.getParent() != null) {
                    ((ViewGroup) keyboard.getParent()).removeView(keyboard);
                  }

                  ReactViewGroup container = (ReactViewGroup) getViewById(viewId);
                  if (container == null) {
                    throw new Exception("Unable to find container with id = " + viewId);
                  }
                  container.addView(keyboard,0);

                  ReactModalHostView modal = (ReactModalHostView) getViewById(modalId);
                  if (modal == null) {
                    throw new Exception("Unable to find modal with id = " + modalId);
                  }
                  modal.onHostResume();
                }
              } else if (keyboard.getParent() == null) {
                activity.addContentView(keyboard, new ViewGroup.LayoutParams(
                  ViewGroup.LayoutParams.MATCH_PARENT,
                  ViewGroup.LayoutParams.MATCH_PARENT
                ));
              }

              inputEventDispatcher.dispatchEvent(new FocusEvent(input.getId()));
              this.eventEmitter.sendEvent(RnKeyboardEventEmitter.KEYBOARD_SHOW, keyboardEventInfo);
              return;
            }

            if(keyboard.getParent() != null) {
              ((ViewGroup) keyboard.getParent()).removeView(keyboard);
            }
            inputEventDispatcher.dispatchEvent(new BlurEvent(input.getId()));
            inputEventDispatcher.dispatchEvent(
              new EndEditingEvent(
                input.getId(), input.getText().toString()));
            this.eventEmitter.sendEvent(RnKeyboardEventEmitter.KEYBOARD_HIDE, keyboardEventInfo);
          } catch (Exception ex) {
            Log.e("# Attach keyboard: ", ex.getMessage());
          }
        });

        input.setOnClickListener((View currentView) -> {
          View keyboard = (View) input.getTag(TAG_ID);

          if (keyboard.getParent() == null) {
              activity.addContentView(
                keyboard,
                new ViewGroup.LayoutParams(
                  ViewGroup.LayoutParams.MATCH_PARENT,
                  ViewGroup.LayoutParams.MATCH_PARENT
                )
              );
            }
        });
        promise.resolve(null);
      } catch (Exception ex) {
        promise.reject(ex);
      }
    });
  }

}
