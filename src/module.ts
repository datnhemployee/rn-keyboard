import { NativeModules, Platform } from 'react-native';
import * as Manager from './manager';
import { EmitterSubscription, NativeEventEmitter } from 'react-native';

const RnKeyboard = NativeModules.RnKeyboard;
export const RN_KEYBOARD_HEIGHT = 216;

/************************
 * Middlewares
 *************************/

const applyAsyncMiddlewares = <AsyncFunc, AppliedFunc extends AsyncFunc>(
  func: AsyncFunc,
  middlewares: ((func: AsyncFunc) => AppliedFunc)[]
): AppliedFunc | AsyncFunc => {
  let appliedFunc: AsyncFunc | null = null;

  middlewares.forEach((middleware) => {
    if (!appliedFunc) {
      appliedFunc = middleware(func);
      return;
    }
    appliedFunc = middleware(appliedFunc);
  }, func);

  if (!appliedFunc) {
    return func;
  }

  return appliedFunc;
};

const applyRequireInputId =
  (asyncHandler: (inputId: number, ...args: any[]) => Promise<any>) =>
  async (inputId: number | null, ...args: any[]) => {
    if (!inputId && typeof inputId === 'object') return;
    return await asyncHandler(inputId, ...args);
  };

const applyPlatformAsync =
  (supportedOSList: typeof Platform['OS'][]) =>
  (asyncHandler: (...args: any[]) => Promise<any>) =>
  async (...args: any[]) => {
    if (!supportedOSList.includes(Platform.OS)) {
      console.error(`#RnKeyboard: Unable to support ${Platform.OS} Platform`);
      return;
    }
    return await asyncHandler(...args);
  };

const applyPlatformSync =
  (supportedOSList: typeof Platform['OS'][]) =>
  (asyncHandler: (...args: any[]) => any) =>
  (...args: any[]) => {
    if (!supportedOSList.includes(Platform.OS)) {
      console.error(`#RnKeyboard: Unable to support ${Platform.OS} Platform`);
      return;
    }
    return asyncHandler(...args);
  };

const applyCatchNativeException =
  (asyncHandler: (...args: any[]) => Promise<any>) =>
  async (...args: any[]) => {
    try {
      return await asyncHandler(...args);
    } catch (err) {
      console.error(`#RnKeyboard: Unable to handle because of ${err}`);
    }
  };

/************************
 * Module
 *************************/

export const init = applyPlatformAsync(['android'])(
  async (height: number = RN_KEYBOARD_HEIGHT): Promise<any> => {
    return await RnKeyboard.init(height);
  }
);

/** @todo handle multiple keyboard types */
export const attach = applyAsyncMiddlewares(
  async (
    inputId: number,
    keyboardType: string,
    options?: {
      modalInfo?: {
        modalId: number | null;
        viewId: number | null;
      };
    }
  ) => {
    if (!inputId && typeof inputId === 'object') return;
    await RnKeyboard.attach(inputId, options);
    Manager.set(inputId, keyboardType);
  },
  [
    applyPlatformAsync(['android', 'ios']),
    applyCatchNativeException,
    applyRequireInputId,
  ]
);

export const detach = applyAsyncMiddlewares(
  async (inputId: number) => {
    await RnKeyboard.detach(inputId);
    Manager.remove(inputId);
  },
  [
    applyPlatformAsync(['android', 'ios']),
    applyCatchNativeException,
    applyRequireInputId,
  ]
);

export const insert = applyAsyncMiddlewares(
  async (inputId: number, key: string) => await RnKeyboard.insert(inputId, key),
  [applyPlatformAsync(['android', 'ios']), applyRequireInputId]
);

export const submit = applyAsyncMiddlewares(
  async (inputId: number) => await RnKeyboard.submit(inputId),
  [applyPlatformAsync(['android', 'ios']), applyRequireInputId]
);

export const backspace = applyAsyncMiddlewares(
  async (inputId: number) => await RnKeyboard.backspace(inputId),
  [applyPlatformAsync(['android', 'ios']), applyRequireInputId]
);

export const addListener = applyPlatformSync(['android'])(
  (
    eventName: RnKeyboardEventType,
    callback: (info: RnKeyboardEventInfo) => void
  ) => {
    const keyboardEventEmitter = new RnKeyboardEventEmitter(RnKeyboard);
    const eventListener = keyboardEventEmitter.addListener(eventName, callback);
    return eventListener;
  }
);

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
