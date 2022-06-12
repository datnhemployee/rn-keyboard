import * as React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Dimensions,
} from 'react-native';
import RnKeyboard from 'rn-keyboard';

const width = Dimensions.get('window').width;
const buttonList = (() => {
  const result: string[][] = [
    ['Backspace', '0', 'Enter'],
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
  ];
  return result.map((row, rowIdx) => ({
    rowIdx,
    buttons: row.map((label) => ({ value: label, label })),
  }));
})();

const RnKeyboardNumeric = () => {
  // const [inputId, setInputId] = React.useState(-1);

  const insert = (type: string) => async () => {
    try {
      const inputId = RnKeyboard.getFocusId();
      console.log('inputId', inputId);
      switch (type) {
        case 'Backspace':
          await RnKeyboard.backspace(inputId);
          return;

        case 'Enter':
          await RnKeyboard.submit(inputId);
          return;

        default:
          await RnKeyboard.insert(inputId, type);
      }
    } catch (err) {
      /** @todo handle error here */
    }
  };

  // React.useEffect(() => {
  //   const rnKeyboardShowListener = RnKeyboard.addListener(
  //     'RnKeyboardShow',
  //     (info) => {
  //       console.log('RnKeyboardShow', info);
  //       setInputId(info.inputId);
  //     }
  //   );
  //   const rnKeyboardHideListener = RnKeyboard.addListener(
  //     'RnKeyboardHide',
  //     (info) => {
  //       console.log('RnKeyboardHide', info);
  //       setInputId(-1);
  //     }
  //   );
  //   return () => {
  //     rnKeyboardShowListener.remove();
  //     rnKeyboardHideListener.remove();
  //   };
  // }, []);

  return (
    <View style={styles.container}>
      {buttonList.map((row) => (
        <View style={styles.row} key={`row-${row.rowIdx}`}>
          {row.buttons.map((button) => (
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.button}
              onPress={insert(button.value)}
              key={`button-${row.rowIdx}-${button.value}`}
            >
              <Text style={styles.text}>{button.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

RnKeyboardNumeric.TYPE = 'RnKeyboardNumeric';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
    paddingVertical: 16,
  },
  row: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: 16,
    paddingVertical: 4,
  },
  button: {
    backgroundColor: '#95a5a6',
    height: 216 /** keyboard height */ / 4 /** number of rows */ - 16,
    width:
      (width - 16 /** row.paddingRight */ - 48) /** button.marginRight */ / 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
    borderRadius: 4,
    paddingBottom: 4,
  },
  text: {
    color: '#ecf0f1',
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default RnKeyboardNumeric;
