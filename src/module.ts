import { NativeModules } from 'react-native';
import * as Manager from './manager';
import { EmitterSubscription, NativeEventEmitter } from 'react-native';

const RnKeyboard = NativeModules.RnKeyboard;
const RN_KEYBOARD_HEIGHT = 216;

/************************
 * Module
 *************************/

export const init = async (
  height: number = RN_KEYBOARD_HEIGHT
): Promise<any> => {
  console.log('init', height);
  return await RnKeyboard.init(height);
};

/** @todo handle multiple keyboard types */
export const attach = async (
  inputId: number,
  keyboardType: string,
  options?: {
    modalInfo?: {
      modalId: number | null;
      viewId: number | null;
    };
  }
): Promise<any> => {
  console.log('attach', inputId, options);
  await RnKeyboard.attach(inputId, options);
  Manager.set(inputId, keyboardType);
};

export const addListener = (
  eventName: RnKeyboardEventType,
  callback: (info: RnKeyboardEventInfo) => void
) => {
  console.log('addListener', eventName, callback);
  const keyboardEventEmitter = new RnKeyboardEventEmitter(RnKeyboard);
  const eventListener = keyboardEventEmitter.addListener(eventName, callback);
  return eventListener;
};

/************************
 * Types
 *************************/

export type RnKeyboardEventType = 'RnKeyboardShow' | 'RnKeyboardHide';

export class RnKeyboardEventEmitter extends NativeEventEmitter {
  addListener(
    eventType: RnKeyboardEventType,
    listener: (...args: any[]) => any,
    context?: any
  ): EmitterSubscription {
    return super.addListener(eventType as string, listener, context);
  }
}

export type RnKeyboardEventInfo = {
  inputId: number;
};
