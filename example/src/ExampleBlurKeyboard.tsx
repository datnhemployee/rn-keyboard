import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import RnKeyboard from 'rn-keyboard';
import { RnKeyboardNumeric } from './keyboards';

const ExampleBlurKeyboard = () => {
  return (
    <ScrollView>
      <RnKeyboard.Input
        rnKeyboardType={RnKeyboardNumeric.TYPE}
        style={styles.input}
        placeholder="ExampleBlurKeyboard: tap here and tap outside to blur the input."
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#2c3e50',
    color: '#2c3e50',
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});

export default ExampleBlurKeyboard;
