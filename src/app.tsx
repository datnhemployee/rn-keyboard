import React from 'react';
import type { EmitterSubscription } from 'react-native';
import * as RnKeyboardManager from './manager';
import * as RnKeyboardModule from './module';

type KeyboardState = {
  keyboardType: string;
};

class RnKeyboardApp extends React.Component<{}, KeyboardState> {
  eventListener: EmitterSubscription | undefined;

  constructor(props: {}) {
    super(props);
    this.state = { keyboardType: '' };
  }

  componentDidMount = async () => {
    this.eventListener = RnKeyboardModule.addListener(
      'RnKeyboardShow',
      (info) => {
        const keyboardType = RnKeyboardManager.get(info.inputId);
        this.setState((state) => ({ ...state, keyboardType }));
      }
    );
  };

  componentWillUnmount = () => {
    if (!this.eventListener?.remove) return;
    this.eventListener.remove();
  };

  render = () => {
    const Keyboard = RnKeyboardManager.getBuilder(this.state.keyboardType);
    if (!Keyboard) return null;
    return <Keyboard />;
  };
}

export default RnKeyboardApp;
