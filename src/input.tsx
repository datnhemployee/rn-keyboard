import React, { forwardRef, useImperativeHandle } from 'react';
import {
  TextInput,
  TextInputProps,
  findNodeHandle,
  Platform,
} from 'react-native';
import type {
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import * as RnKeyboardModule from './module';
import * as RnKeyboardManager from './manager';
import * as RnKeyboardHelper from './helper';

type RnInputHandler = {
  focus?: () => void;
  blur?: () => void;
};

type RnInputProps = TextInputProps & {
  rnKeyboardType: string;
  modalInfo?: { viewId: number | null; modalId: number | null };
};

const RnInput = forwardRef<RnInputHandler, RnInputProps>((props, ref) => {
  const [refInput, setRefInput] = React.useState(null);

  const onFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (refInput && Platform.OS === 'ios') {
      const inputId = findNodeHandle(refInput);
      if (inputId) {
        RnKeyboardManager.setFocusId(inputId);
      }
    }

    if (!props.onFocus) return;
    props.onFocus(e);
  };

  React.useEffect(() => {
    (async () => {
      if (!refInput) return;
      const inputId = findNodeHandle(refInput);

      if (!inputId) return;
      await RnKeyboardModule.attach(
        inputId,
        props.rnKeyboardType,
        (() => {
          if (
            [
              typeof props?.modalInfo?.modalId,
              typeof props?.modalInfo?.viewId,
            ].includes('undefined')
          ) {
            return undefined;
          }
          return { modalInfo: props.modalInfo };
        })()
      );
      /**
       * @todo Refactor this to improve performance
       * Keyboard need first time showing up to get inputId */
      // (refInput as { focus: () => void }).focus();
      // (refInput as { blur: () => void }).blur();
    })();

    return () => {
      (async () => {
        const inputId = findNodeHandle(refInput);
        if (RnKeyboardHelper.checkNull(inputId)) return;
        await RnKeyboardModule.detach(inputId as number);
      })();
    };
  }, [props?.modalInfo, props.rnKeyboardType, refInput]);

  useImperativeHandle(ref, () => (refInput ? refInput : {}), [refInput]);

  return (
    <TextInput
      ref={setRefInput as React.LegacyRef<TextInput>}
      {...props}
      onFocus={onFocus}
      showSoftInputOnFocus={false}
    />
  );
});

export default RnInput;
