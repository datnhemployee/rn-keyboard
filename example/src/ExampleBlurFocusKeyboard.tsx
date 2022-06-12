import React, { ElementRef, useRef } from 'react';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RnKeyboard from 'rn-keyboard';
import { RnKeyboardNumeric } from './keyboards';

const ExampleBlurFocusKeyboard = () => {
  const ref = useRef<ElementRef<typeof RnKeyboard.Input>>(null);

  const focus = () => (ref.current?.focus ? ref.current.focus() : null);
  const blur = () => (ref.current?.blur ? ref.current.blur() : null);
  const onBlur = () => console.log('blur');
  const onFocus = () => console.log('focus');
  const onSubmitEditing = () => console.log('onSubmitEditing');
  const onChangeText = () => console.log('onChangeText');

  return (
    <ScrollView>
      <View style={styles.wrapperButtons}>
        <TouchableOpacity style={styles.button} onPress={focus}>
          <Text style={styles.text}>Focus</Text>
        </TouchableOpacity>

        <View style={styles.spaceHorizontal} />

        <TouchableOpacity style={styles.button} onPress={blur}>
          <Text style={styles.text}>Blur</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.spaceVertical} />

      <RnKeyboard.Input
        ref={ref}
        rnKeyboardType={RnKeyboardNumeric.TYPE}
        style={styles.input}
        placeholder="ExampleBlurFocusKeyboard: tap button to focus the input."
        onBlur={onBlur}
        onFocus={onFocus}
        onSubmitEditing={onSubmitEditing}
        onChangeText={onChangeText}
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
  button: {
    padding: 4,
    backgroundColor: '#2c3e50',
    borderRadius: 4,
  },
  text: { color: '#ecf0f1' },
  wrapperButtons: { flexDirection: 'row' },
  spaceHorizontal: { width: 8 },
  spaceVertical: { height: 8 },
});

export default ExampleBlurFocusKeyboard;
