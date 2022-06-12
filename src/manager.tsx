const KEYBOARD_TYPE_INPUT_LIST: { [inputId: number]: string } = {};
const KEYBOARD_TYPE_COMPONENT_LIST: {
  [keyboardType: string]: React.ElementType;
} = {};

export const set = (inputId: number, keyboardType: string) =>
  (KEYBOARD_TYPE_INPUT_LIST[inputId] = keyboardType);
export const remove = (inputId: number) =>
  delete KEYBOARD_TYPE_INPUT_LIST[inputId];
export const get = (inputId: number) => KEYBOARD_TYPE_INPUT_LIST[inputId];

export const registerKeyboard = (
  keyboardType: string,
  Comp: React.ElementType
) => (KEYBOARD_TYPE_COMPONENT_LIST[keyboardType] = Comp);

export const getBuilder = (keyboardType: string) =>
  KEYBOARD_TYPE_COMPONENT_LIST[keyboardType];

// IOS only ---------------------------------------
/**
 * Currently, React Native IOS Native modules gives no luck in implementing `onFocus` & `onBLur` listener.
 * Therefore, I implement the one in JS side.
 */

const INPUT_FOCUS_INFO: { inputId: number } = { inputId: -1 };

export const setFocusId = (inputId: number, isFocus: boolean = true) => {
  INPUT_FOCUS_INFO.inputId = isFocus ? inputId : -1;
};

export const getFocusId = () => INPUT_FOCUS_INFO.inputId;
