import React from 'react';
import * as RnKeyboardManager from './manager';

type KeyboardState = {
  keyboardType: string;
};

class RnKeyboardApp extends React.Component<{}, KeyboardState> {
  keyboardShowEmitter: { remove: () => void } | null;

  constructor(props: {}) {
    super(props);
    this.state = { keyboardType: '' };
    this.keyboardShowEmitter = null;
  }

  componentDidMount = async () => {
    this.keyboardShowEmitter = RnKeyboardManager.addListener(
      'RnKeyboardShow',
      (inputId) => {
        const keyboardType = RnKeyboardManager.get(inputId);
        this.setState((state) => ({ ...state, keyboardType }));
      }
    );
  };

  componentWillUnmount = () => {
    if (!this.keyboardShowEmitter?.remove) return;
    this.keyboardShowEmitter.remove();
  };

  render = () => {
    const Keyboard = RnKeyboardManager.getBuilder(this.state.keyboardType);
    if (!Keyboard) return null;
    return <Keyboard />;
  };
}

export default RnKeyboardApp;
