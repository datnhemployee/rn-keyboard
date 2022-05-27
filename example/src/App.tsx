import * as React from 'react';

import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Text,
  ModalProps,
  findNodeHandle,
} from 'react-native';
import RnKeyboard from 'rn-keyboard';
import { RnKeyboardNumeric } from './keyboards';

const ModalWithRnKeyboardInput: React.FunctionComponent<ModalProps> = (
  props
) => {
  const modalRef = React.useRef(null);
  const viewRef = React.useRef(null);
  const [modalInfo, setModalInfo] = React.useState<{
    viewId: number | null;
    modalId: number | null;
  } | null>(null);

  const onShow = () => {
    const modalId = findNodeHandle(modalRef.current);
    const viewId = findNodeHandle(viewRef.current);
    setModalInfo({ modalId, viewId });
  };

  return (
    <Modal ref={modalRef} {...props} onShow={onShow}>
      <View ref={viewRef} style={{ flex: 1, backgroundColor: '#2c3e50' }}>
        <RnKeyboard.Input
          rnKeyboardType={RnKeyboardNumeric.TYPE}
          style={styles.input}
          modalInfo={
            modalInfo as unknown as {
              viewId: number | null;
              modalId: number | null;
            }
          }
        />
      </View>
    </Modal>
  );
};

const App = () => {
  const [isVisibleModal, setVisibleModal] = React.useState(false);

  const toggleModal = () => setVisibleModal((_isVisible) => !_isVisible);
  const closeModal = () => setVisibleModal(false);

  React.useEffect(() => {
    /**
     * Don't put RnKeyboardModule.init here,
     * it shall make RnKeyboardApp re-mount infinitely */
    RnKeyboard.registerKeyboard(RnKeyboardNumeric.TYPE, RnKeyboardNumeric);
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleModal}>
        <Text>Show modal includes input</Text>
      </TouchableOpacity>

      <RnKeyboard.Input
        rnKeyboardType={RnKeyboardNumeric.TYPE}
        style={styles.input}
      />

      <ModalWithRnKeyboardInput
        visible={isVisibleModal}
        onRequestClose={closeModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
  },
});

export default RnKeyboard.connect(App);
