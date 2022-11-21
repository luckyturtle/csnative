import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import DatePicker from 'react-native-date-picker';
import { Navigation } from 'react-native-navigation';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 10,
  },
button: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: '$borderRadius',
    backgroundColor: '$buttonBackgroundColor',
  },
  buttonText: {
    color: '$buttonWithBackgroundTextColor',
    fontSize: '0.9rem',
  },
});

interface FeatureVariant {
  variant: string;
  variant_id: number;
  selected: boolean;
}

interface Feature {
  description: string;
  feature_id: number;
  feature_type: string;
  value: string;
  variant: string;
  variant_id: number;
  value_int: number;
  variants: [FeatureVariant];
}

interface DatePickerScreenProps {
  componentId: string;
  feature: Feature;
  changeDateHandler: Function;
  title: string;
}

export const DatePickerScreen: React.FC<DatePickerScreenProps> = ({
  componentId,
  feature,
  changeDateHandler,
  title,
}) => {
  const [date, setDate] = useState(new Date(feature.value_int * 1000));

  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: title.toUpperCase(),
        },
      },
    });
  }, []);

  return (
    <View style={styles.container}>
      <DatePicker date={date} onDateChange={setDate} mode={'date'} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          changeDateHandler(feature, date);
          Navigation.dismissModal(componentId);
        }}>
        <Text style={styles.buttonText}>Ok</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DatePickerScreen;
