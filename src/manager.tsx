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

const INPUT_FOCUS_INFO: { inputId: number } = { inputId: -1 };
export const setFocusId = (inputId: number, isFocus: boolean = true) => {
  INPUT_FOCUS_INFO.inputId = isFocus ? inputId : -1;
};
export const getFocusId = () => INPUT_FOCUS_INFO.inputId;

type Emitter = { remove: () => void };
let LISTENER_LIST: {
  name: string;
  func: (payload: any) => any;
}[] = [];

export const emit = (name: string, payload: any) =>
  LISTENER_LIST.forEach((listener) => {
    if (listener.name !== name) return;
    listener.func(payload);
  });

export const addListener = (
  name: string,
  callback: (payload: any) => any
): Emitter => {
  const listener = { name, func: callback };
  LISTENER_LIST.push(listener);
  return {
    remove: () => {
      LISTENER_LIST = LISTENER_LIST.filter(
        (_listener) => _listener !== listener
      );
    },
  };
};
