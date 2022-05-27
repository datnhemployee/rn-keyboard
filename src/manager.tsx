const KEYBOARD_TYPE_INPUT_LIST: { [inputId: number]: string } = {};
const KEYBOARD_TYPE_COMPONENT_LIST: {
  [keyboardType: string]: React.ElementType;
} = {};

export const set = (inputId: number, keyboardType: string) =>
  (KEYBOARD_TYPE_INPUT_LIST[inputId] = keyboardType);
export const get = (inputId: number) => KEYBOARD_TYPE_INPUT_LIST[inputId];

export const registerKeyboard = (
  keyboardType: string,
  Comp: React.ElementType
) => (KEYBOARD_TYPE_COMPONENT_LIST[keyboardType] = Comp);

export const getBuilder = (keyboardType: string) =>
  KEYBOARD_TYPE_COMPONENT_LIST[keyboardType];
