import React from 'react';
import { AppRegistry } from 'react-native';
import RnKeyboardApp from './app';
import * as Manager from './manager';
import * as RnKeyboardModule from './module';
import RnKeyboardInput from './input';
import RnKeyboardSpacer from './spacer';

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

const RnKeyboard = {
  registerKeyboard,
  registerComponent,
  connect,
  Input: RnKeyboardInput,
  Spacer: RnKeyboardSpacer,
  // actions -----------------
  insert: RnKeyboardModule.insert,
  submit: RnKeyboardModule.submit,
  backspace: RnKeyboardModule.backspace,
  // listeners to keyboard show/hide event -----------------
  addListener: RnKeyboardModule.addListener,
  getFocusId: Manager.getFocusId,
};
export default RnKeyboard;
