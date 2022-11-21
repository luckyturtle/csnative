import React from 'react';
import { connect, RootStateOrAny } from 'react-redux';
import { View, Text, ScrollView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import i18n from '../utils/i18n';
import { formatPrice } from '../utils';

// Components
import Section from '../components/Section';

const styles = EStyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    textAlign: 'left',
  },
  rowTitle: {
    paddingVertical: 5,
    paddingRight: 10,
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
  text: {
    fontSize: '0.9rem',
    padding: 5,
  }
});

interface Price {
  product_id: string;
  lower_limit: string;
  percentage_discount: number;
  price: string;
}

interface QuantityDiscountsProps {
  prices: [
    Price
  ];
  title: boolean;
}

export const QuantityDiscounts: React.FC<QuantityDiscountsProps> = ({
  prices,
  title = true,
}) => {
  if (!prices) {
    return null;
  }

  return (
    <Section
      title={i18n.t('Our quantity discounts')}
      wrapperStyle={styles.wrapperStyle}
      topDivider
    >
      <ScrollView horizontal={true}>
        <View style={styles.container}>
          <View>
            <Text style={styles.rowTitle}>{i18n.t('Quantity')}</Text>
            <Text style={styles.rowTitle}>{i18n.t('Price')}</Text>
          </View>
          {prices.map((item: Price, index: number) => {
            const { lower_limit, price } = item;
            return (
              <View>
                <Text style={styles.text}>{`${lower_limit}+`}</Text>
                <Text style={styles.text}>{formatPrice(price)}</Text>
              </View>
            )
          })}
        </View>
      </ScrollView>
    </Section>
  );
};

export default connect((state: RootStateOrAny) => ({
  productReviews: state.productReviews,
}))(QuantityDiscounts);
