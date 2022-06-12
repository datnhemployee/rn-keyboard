import React from 'react';
import {
  findNodeHandle,
  Modal,
  ModalProps,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
      {/** @todo Issue#1: Weird UI when add margin to modalView */}
      <View ref={viewRef} style={styles.modalView}>
        {/** TITLE */}
        <Text style={styles.modalTitle}>ExampleModalKeyboard: Modal</Text>

        {/** INPUT */}
        <RnKeyboard.Input
          rnKeyboardType={RnKeyboardNumeric.TYPE}
          style={styles.input}
          modalInfo={
            modalInfo as unknown as {
              viewId: number | null;
              modalId: number | null;
            }
          }
          placeholder="ExampleModalKeyboard: tap here and tap outside to blur the input."
        />

        {/** BUTTON CLOSE */}
        <TouchableOpacity
          style={styles.modalButtonClose}
          onPress={props?.onRequestClose}
        >
          <Text style={styles.modalTextClose}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const ExampleModalKeyboard = () => {
  const [isVisibleModal, setVisibleModal] = React.useState(false);

  const toggleModal = () => setVisibleModal((_isVisible) => !_isVisible);
  const closeModal = () => setVisibleModal(false);

  return (
    <>
      {/** Please put your modal inside scrollview to help textinput detect blur event. */}
      <ScrollView>
        {/** BUTTON SHOW MODAL */}
        <TouchableOpacity style={styles.button} onPress={toggleModal}>
          <Text style={styles.text}>ExampleModalKeyboard: show modal</Text>
        </TouchableOpacity>

        {/** MODAL WITH NESTED INPUT */}
        <ModalWithRnKeyboardInput
          visible={isVisibleModal}
          onRequestClose={closeModal}
        />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2c3e50',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  text: {
    color: '#ecf0f1',
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#2c3e50',
    color: '#2c3e50',
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  modalView: {
    flex: 1,
    backgroundColor: '#2c3e50',
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  modalTitle: {
    color: '#ecf0f1',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 32,
  },
  modalButtonClose: {
    position: 'absolute',
    top: 0,
    right: 0,
    marginRight: 16,
    marginTop: 16,
    height: 32,
    padding: 4,
    borderRadius: 4,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTextClose: {
    color: '#2c3e50',
    fontWeight: 'bold',
  },
});

export default ExampleModalKeyboard;
