import React from 'react';
import { TextInput, TextInputProps, findNodeHandle } from 'react-native';
import * as RnKeyboardModule from './module';

const RnInput: React.FunctionComponent<
  TextInputProps & {
    rnKeyboardType: string;
    modalInfo?: { viewId: number | null; modalId: number | null };
  }
> = (props) => {
  const [refInput, setRefInput] = React.useState(null);

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
    })();
  }, [props?.modalInfo, props.rnKeyboardType, refInput]);

  return (
    <TextInput
      ref={setRefInput as React.LegacyRef<TextInput>}
      {...props}
      showSoftInputOnFocus={false}
    />
  );
};

export default RnInput;
