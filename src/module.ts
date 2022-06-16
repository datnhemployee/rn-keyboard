import { NativeModules, Platform } from 'react-native';
import * as Manager from './manager';

const RnKeyboard = NativeModules.RnKeyboard;
export const RN_KEYBOARD_HEIGHT = 216;

/************************
 * Middlewares
 *************************/

const applyMiddlewares = <Func>(
  func: Func,
  middlewares: ((func: Func) => Func)[]
): Func => {
  let appliedFunc: Func | null = null;

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
  (supportedOSList: typeof Platform['OS'][], actionName: string) =>
  (asyncHandler: (...args: any[]) => Promise<any>) =>
  async (...args: any[]) => {
    if (!supportedOSList.includes(Platform.OS)) {
      console.log(
        `#RnKeyboard-warning: Unable to support RnKeyboard.${actionName} in ${Platform.OS} Platform`
      );
      return;
    }
    return await asyncHandler(...args);
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

export const init = applyMiddlewares(
  async (height: number = RN_KEYBOARD_HEIGHT): Promise<any> => {
    return await RnKeyboard.init(height);
  },
  [applyPlatformAsync(['android'], 'init')]
);

/** @todo handle multiple keyboard types */
export const attach = applyMiddlewares(
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
    applyPlatformAsync(['android', 'ios'], 'attach'),
    applyCatchNativeException,
    applyRequireInputId,
  ]
);

export const detach = applyMiddlewares(
  async (inputId: number) => {
    await RnKeyboard.detach(inputId);
    Manager.remove(inputId);
  },
  [
    applyPlatformAsync(['android', 'ios'], 'detach'),
    applyCatchNativeException,
    applyRequireInputId,
  ]
);

export const insert = applyMiddlewares(
  async (inputId: number, key: string) => await RnKeyboard.insert(inputId, key),
  [applyPlatformAsync(['android', 'ios'], 'insert'), applyRequireInputId]
);

export const submit = applyMiddlewares(
  async (inputId: number) => await RnKeyboard.submit(inputId),
  [applyPlatformAsync(['android', 'ios'], 'submit'), applyRequireInputId]
);

export const backspace = applyMiddlewares(
  async (inputId: number) => await RnKeyboard.backspace(inputId),
  [applyPlatformAsync(['android', 'ios'], 'backspace'), applyRequireInputId]
);

/************************
 * Types
 *************************/

export type RnKeyboardEventType = 'RnKeyboardShow' | 'RnKeyboardHide';

export type RnKeyboardEventInfo = {
  inputId: number;
};
