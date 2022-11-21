import React, { useState, useEffect } from 'react';
import { View, Text, Switch } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  optionTitleWrapper: {
    flexDirection: 'row',
  },
  containerWarning: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '$dangerColor',
    padding: 5,
    borderRadius: '$borderRadius',
  },
  title: {
    fontSize: '0.9rem',
    textAlign: 'left',
  },
  optionRequiredSign: {
    color: 'red',
  },
});

/**
 * Renders the option to switch product properties.
 *
 * @reactProps {object} value - Information about the initial value of the switch.
 * @reactProps {object} option - Information about the option and its variants.
 * @reactProps {function} onChange - Change function.
 */
export const CheckboxOption = ({ option, onChange, value }) => {
  const [title, setTitile] = useState('');
  const [currentValue, setCurrentValue] = useState(false);
  const isOptionRequired = option.required === 'Y';

  /**
   * Sets initial value to state.
   * Sets title.
   */
  useEffect(() => {
    setTitile(option.option_name);
    setCurrentValue(!!parseInt(value?.position, 10));
  }, [value, option]);

  /**
   * Switches option value.
   *
   * @param {boolean} v -  Switcher value.
   */
  const handleChange = (v) => {
    return onChange(option.selectVariants[v ? 0 : 1]);
  };

  return (
    <View
      style={
        option.requiredOptionWarning
          ? styles.containerWarning
          : styles.container
      }>
      <View style={styles.optionTitleWrapper}>
        <Text style={styles.title}>{title}:</Text>
        {isOptionRequired && <Text style={styles.optionRequiredSign}> *</Text>}
      </View>
      <Switch value={currentValue} onValueChange={(v) => handleChange(v)} />
    </View>
  );
};
