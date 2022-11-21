import React, { useEffect } from 'react';
import { connect, RootStateOrAny } from 'react-redux';
import { ScrollView, Text, View, Switch } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { iconsMap } from '../utils/navIcons';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    padding: 10,
  },
  itemWrapper: {
    marginVertical: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemText: {
    fontSize: '1rem',
  },
});

interface FeatureVariant {
  variant: string;
  variant_id: number;
  selected: boolean;
}

interface ProductFeatures {
  [key: string]: Feature;
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

interface MultipleCheckboxPickerProps {
  componentId: string;
  featureId: string;
  changeMultipleCheckboxValueHandler: Function;
  title: string;
  productFeatures: ProductFeatures;
}

export const MultipleCheckboxPicker: React.FC<MultipleCheckboxPickerProps> = ({
  componentId,
  featureId,
  changeMultipleCheckboxValueHandler,
  title,
  productFeatures,
}) => {
  const listener = {
    navigationButtonPressed: ({ buttonId }) => {
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
  }, []);

  const changeHandler = (variantId: number) => {
    if (!productFeatures[featureId]) {
      return;
    }

    productFeatures[featureId].variants.map((variant) => {
      if (variant.variant_id === variantId) {
        variant.selected = !variant.selected;
      }
      return variant;
    });

    changeMultipleCheckboxValueHandler(featureId, productFeatures[featureId]);
  };

  const renderItem = (featureVariant: FeatureVariant, index: number) => {
    const { variant, selected, variant_id } = featureVariant;

    return (
      <View style={styles.itemWrapper} key={index}>
        <Text style={styles.itemText}>{variant}</Text>
        <Switch
          value={selected}
          onValueChange={() => changeHandler(variant_id)}
        />
      </View>
    );
  };

  if (!productFeatures[featureId]) {
    return <View />;
  }

  return (
    <ScrollView style={styles.container}>
      {productFeatures[featureId].variants.map((featureVariant, index) => {
        return renderItem(featureVariant, index);
      })}
    </ScrollView>
  );
};

export default connect((state: RootStateOrAny) => ({
  productFeatures: state.vendorManageProducts.productFeatures,
}))(MultipleCheckboxPicker);
