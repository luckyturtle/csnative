import React from 'react';
import { View } from 'react-native';
import Dialog from 'react-native-dialog';
import i18n from '../utils/i18n';

interface AndroidAlertInput {
  title: string;
  description: string;
  inputPlacholder: string;
  inputValue: string;
  inputOnChangeText: ((text: string) => void) | undefined;
  cancelButtonLabel: string;
  cancelButtonHandler: () => void;
  deleteButtonLabel: string;
  deleteButtonHandler: () => void;
  isVisible: boolean;
}

export const AndroidAlertInput: React.FC<AndroidAlertInput> = ({
  title,
  description,
  inputPlacholder,
  inputValue,
  inputOnChangeText,
  cancelButtonLabel,
  cancelButtonHandler,
  deleteButtonLabel,
  deleteButtonHandler,
  isVisible,
}) => {
  return (
    <View>
      <Dialog.Container visible={isVisible}>
        <Dialog.Title>{i18n.t(title)}</Dialog.Title>
        <Dialog.Description>{i18n.t(description)}</Dialog.Description>
        <Dialog.Input
          placeholder={i18n.t(inputPlacholder)}
          value={inputValue}
          onChangeText={inputOnChangeText}
        />
        <Dialog.Button
          label={i18n.t(cancelButtonLabel)}
          onPress={cancelButtonHandler}
        />
        <Dialog.Button
          label={i18n.t(deleteButtonLabel)}
          onPress={deleteButtonHandler}
        />
      </Dialog.Container>
    </View>
  );
};
