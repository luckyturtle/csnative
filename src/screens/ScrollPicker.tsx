import React, { useEffect } from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { iconsMap } from '../utils/navIcons';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = (isItemActive: boolean | null) =>
  EStyleSheet.create({
    container: {
      padding: 10,
    },
    itemWrapper: {
      marginVertical: 10,
      textAlign: 'center',
      paddingVertical: 5,
      borderRadius: '$borderRadius',
      backgroundColor: isItemActive ? '$buttonBackgroundColor' : undefined,
    },
    itemText: {
      fontSize: '1rem',
      textAlign: 'center',
      color: isItemActive ? '#fff' : undefined,
    },
  });

interface ScrollPickerProps {
  componentId: string;
  pickerValues: string[];
  changePickerValueHandler: Function;
  selectValue: string;
  title: string;
  additionalData: {
    [key: string]: any;
  };
}

export const ScrollPicker: React.FC<ScrollPickerProps> = ({
  componentId,
  pickerValues,
  changePickerValueHandler,
  selectValue,
  title,
  additionalData,
}) => {
  const listener = {
    navigationButtonPressed: ({ buttonId }: { buttonId: string }) => {
      if (buttonId === 'close') {
        Navigation.dismissModal(componentId);
      }
    },
  };

  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: title.toUpperCase(),
        },
        rightButtons: [
          {
            id: 'close',
            icon: iconsMap.close,
          },
        ],
      },
    });

    const listeners = Navigation.events().registerComponentListener(
      listener,
      componentId,
    );

    return () => {
      listeners.remove();
    };
  });

  const renderItem = (value: string, index: number) => {
    const isItemActive = value === selectValue;

    return (
      <TouchableOpacity
        activeOpacity={isItemActive ? 1 : 0.2}
        style={styles(isItemActive).itemWrapper}
        onPress={
          !isItemActive
            ? () => {
                changePickerValueHandler(value, additionalData);
                Navigation.dismissModal(componentId);
              }
            : undefined
        }
        key={index}>
        <Text style={styles(isItemActive).itemText}>{value}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles(null).container}>
      {pickerValues.map((value, index) => {
        return renderItem(value, index);
      })}
    </ScrollView>
  );
};

export default ScrollPicker;
