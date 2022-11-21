import React from 'react';
import { FEATURE_TYPE_DATE, FEATURE_TYPE_CHECKBOX } from '../constants';
import { format } from 'date-fns';
import { connect, RootStateOrAny } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import i18n from '../utils/i18n';

// Components
import Section from '../components/Section';
import SectionRow from '../components/SectionRow';

const styles = EStyleSheet.create({
  container: {
    padding: 20,
  },
});

interface Feature {
  description: string;
  feature_id: number;
  feature_type: string;
  value: string;
  variant: string;
  variant_id: string;
  value_int: number;
}

interface ProductFeaturesListProps {
  productFeatures: {
    [key: string]: Feature;
  };
  title: boolean;
}

export const ProductFeaturesList: React.FC<ProductFeaturesListProps> = ({
  productFeatures,
  title = true,
  settings,
}) => {
  const renderFeatureItem = (
    feature: Feature,
    index: number,
    last: boolean,
  ) => {
    const { description, feature_type, value_int, value, variant } = feature;

    let newValue = null;
    switch (feature_type) {
      case FEATURE_TYPE_DATE:
        newValue = format(value_int * 1000, settings.dateFormat);
        break;
      case FEATURE_TYPE_CHECKBOX:
        newValue = feature.value === 'Y' ? i18n.t('Yes') : i18n.t('No');
        break;
      default:
        newValue = value || variant;
    }

    return (
      <SectionRow name={description} value={newValue} last={last} key={index} />
    );
  };

  const features = Object.keys(productFeatures).map(
    (k: string) => productFeatures[k],
  );

  if (!features.length) {
    return null;
  }

  const lastElement = features.length - 1;

  return (
    <Section
      title={title ? i18n.t('Features') : ''}
      wrapperStyle={styles.wrapperStyle}
      topDivider>
      {features.map((item, index) =>
        renderFeatureItem(item, index, index === lastElement),
      )}
    </Section>
  );
};

export default connect((state: RootStateOrAny) => ({
  productReviews: state.productReviews,
  settings: state.settings,
}))(ProductFeaturesList);
