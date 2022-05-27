import * as React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

export default function RnKeyboardNumeric() {
  return (
    <TouchableOpacity style={styles.container}>
      <Text>This is testing</Text>
    </TouchableOpacity>
  );
}

RnKeyboardNumeric.TYPE = 'RnKeyboardNumeric';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
