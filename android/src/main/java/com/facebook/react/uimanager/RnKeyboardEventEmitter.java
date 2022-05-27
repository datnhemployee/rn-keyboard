package com.facebook.react.uimanager;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import javax.annotation.Nullable;

public class RnKeyboardEventEmitter {
  public final static String KEYBOARD_HIDE = "RnKeyboardHide";
  public final static String KEYBOARD_SHOW = "RnKeyboardShow";
  private ReactContext reactContext;

  RnKeyboardEventEmitter (ReactContext reactContext) {
    this.reactContext = reactContext;
  }

  public void sendEvent(String eventName,
                         @Nullable WritableMap params) {
    this.reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, params);
  }
}
