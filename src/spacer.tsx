import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import * as RnKeyboardModule from './module';

const RnKeyboardSpacer = () => {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const rnKeyboardShowListener = RnKeyboardModule.addListener(
      'RnKeyboardShow',
      () => setHeight(RnKeyboardModule.RN_KEYBOARD_HEIGHT)
    );
    const rnKeyboardHideListener = RnKeyboardModule.addListener(
      'RnKeyboardHide',
      () => setHeight(0)
    );
    return () => {
      rnKeyboardShowListener.remove();
      rnKeyboardHideListener.remove();
    };
  }, []);

  return <View style={{ height }} />;
};

export default RnKeyboardSpacer;
