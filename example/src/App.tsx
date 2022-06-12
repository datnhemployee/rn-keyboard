import * as React from 'react';

import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import RnKeyboard from 'rn-keyboard';
import ExampleBlurFocusKeyboard from './ExampleBlurFocusKeyboard';
import ExampleBlurKeyboard from './ExampleBlurKeyboard';
import ExampleModalKeyboard from './ExampleModalKeyboard';
import { RnKeyboardNumeric } from './keyboards';

const App = () => {
  React.useEffect(() => {
    RnKeyboard.registerKeyboard(RnKeyboardNumeric.TYPE, RnKeyboardNumeric);
  }, []);

  return (
    <>
      {/** LIST OF EXAMPLES */}
      <ScrollView style={styles.container}>
        {/** EXAMPLE 1: How to blur an input */}
        <View style={styles.spaceVertical} />
        <ExampleBlurKeyboard />

        {/** EXAMPLE 2: Nested input inside modal */}
        <View style={styles.spaceVertical} />
        <ExampleModalKeyboard />

        {/** EXAMPLE 3: Blur/focus input programatically */}
        <View style={styles.spaceVertical} />
        <ExampleBlurFocusKeyboard />
      </ScrollView>

      {/** SPACER */}
      <RnKeyboard.Spacer />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 32,
    backgroundColor: '#ecf0f1',
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
  },
  spaceVertical: { height: 32 },
});

export default RnKeyboard.connect(App);
