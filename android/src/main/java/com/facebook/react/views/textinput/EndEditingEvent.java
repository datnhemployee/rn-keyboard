package com.facebook.react.views.textinput;

public class EndEditingEvent extends ReactTextInputEndEditingEvent {
  public EndEditingEvent(int viewId, String text) {
    super(viewId, text);
  }
}
