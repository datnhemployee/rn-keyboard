import React from 'react';
import { AppRegistry } from 'react-native';
import RnKeyboardApp from './app';
import * as Manager from './manager';
import * as RnKeyboardModule from './module';
import RnKeyboardInput from './input';

export const registerKeyboard = Manager.registerKeyboard;
export const registerComponent = () =>
  AppRegistry.registerComponent('RnKeyboard', () => RnKeyboardApp);
export const connect = (App: React.ElementType) => (props: {}) => {
  const NativeKeyboard = () => {
    React.useEffect(() => {
      RnKeyboardModule.init();
    }, []);
    return null;
  };

  return (
    <>
      <App {...props} />
      <NativeKeyboard />
    </>
  );
};
export { RnKeyboardInput };

export default {
  registerKeyboard,
  registerComponent,
  connect,
  Input: RnKeyboardInput,
};
