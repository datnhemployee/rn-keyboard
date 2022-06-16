import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import * as RnKeyboardManager from './manager';
import * as RnKeyboardModule from './module';

const RnKeyboardSpacer = () => {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const keyboardShowEmitter = RnKeyboardManager.addListener(
      'RnKeyboardShow',
      () => setHeight(RnKeyboardModule.RN_KEYBOARD_HEIGHT)
    );
    const keyboardHideEmitter = RnKeyboardManager.addListener(
      'RnKeyboardHide',
      () => setHeight(0)
    );
    return () => {
      keyboardShowEmitter.remove();
      keyboardHideEmitter.remove();
    };
  }, []);

  return <View style={{ height }} />;
};

export default RnKeyboardSpacer;
