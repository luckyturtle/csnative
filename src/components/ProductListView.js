import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import toInteger from 'lodash/toInteger';
import get from 'lodash/get';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  PRODUCT_IMAGE_WIDTH,
  formatPrice,
  getImagePath,
  PRODUCT_NUM_COLUMNS,
} from '../utils';
import i18n from '../utils/i18n';
import StarsRating from '../components/StarsRating';

const RATING_STAR_SIZE = 14;

const styles = EStyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '$productBorderColor',
    borderRadius: '$borderRadius',
    backgroundColor: '#fff',
    margin: 5,
    marginBottom: 15,
    padding: 15,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: PRODUCT_IMAGE_WIDTH + 105,
    maxWidth: `${Math.floor(94 / PRODUCT_NUM_COLUMNS)}%`,
  },
  productImage: {
    width: PRODUCT_IMAGE_WIDTH,
    height: PRODUCT_IMAGE_WIDTH,
  },
  description: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  productName: {
    color: '#2b2b2b',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  productPrice: {
    fontWeight: 'bold',
    textAlign: 'left',
  },
  listDiscountWrapper: {
    backgroundColor: '$productDiscountColor',
    position: 'absolute',
    top: 4,
    right: 4,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: '$borderRadius',
    width: 100,
  },
  priceWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  listPriceText: {
    textDecorationLine: 'line-through',
    color: '$darkColor',
    textAlign: 'left',
    paddingRight: 4,
    paddingTop: 2,
    fontSize: 12,
  },
  listDiscountText: {
    color: '#fff',
    textAlign: 'left',
  },
  rating: {
    marginLeft: -10,
    marginRight: -10,
    marginTop: 0,
  },
});

/**
 * Renders a product card.
 *
 * @reactProps {object} product - Product information.
 * @reactProps {function} onPress - Opens product screen.
 */
class ProductListView extends PureComponent {
  /**
   * @ignore
   */
  static propTypes = {
    product: PropTypes.shape({
      item: PropTypes.object,
    }),
    onPress: PropTypes.func,
  };

  /**
   * Renders discount.
   *
   * @return {JSX.Element}
   */
  renderDiscount = () => {
    const { product } = this.props;
    const { item } = product;

    if (!item.list_discount_prc && !item.discount_prc) {
      return null;
    }

    const discount = item.list_discount_prc || item.discount_prc;

    return (
      <View style={styles.listDiscountWrapper}>
        <Text style={styles.listDiscountText} numberOfLines={1}>
          {i18n.t('Discount')} {`${discount}%`}
        </Text>
      </View>
    );
  };

  /**
   * Renders price.
   *
   * @return {JSX.Element}
   */
  renderPrice = () => {
    const { product, settings, auth } = this.props;
    const { item } = product;
    const productTaxedPrice = get(item, 'taxed_price_formatted.price', '');
    const productPrice =
      productTaxedPrice || get(item, 'price_formatted.price', product.price);
    let discountPrice = null;

    if (toInteger(item.discount_prc)) {
      discountPrice = item.base_price_formatted.price;
    } else if (toInteger(item.list_price)) {
      discountPrice = item.list_price_formatted.price;
    }

    const isProductPriceZero = Math.ceil(item.price) === 0;
    const showDiscount =
      isProductPriceZero && (item.discount_prc || item.list_discount_prc);
    const isForbiddenShopping =
      settings.checkout.allowAnonymousShopping === 'hide_price_and_add_to_cart';

    const renderProductPrice = () => {
      if (isForbiddenShopping && !auth.logged) {
        return (
          <Text numberOfLines={2} style={styles.productPrice}>
            {i18n.t('Sign in to view price')}
          </Text>
        );
      }

      return (
        <Text numberOfLines={1} style={styles.productPrice}>
          {formatPrice(productPrice)}
        </Text>
      );
    };

    return (
      <View style={styles.priceWrapper}>
        {showDiscount && (
          <Text style={styles.listPriceText}>{discountPrice}</Text>
        )}
        {isProductPriceZero ? (
          <Text>{i18n.t('Contact us for a price')}</Text>
        ) : (
          renderProductPrice()
        )}
      </View>
    );
  };

  /**
   * Renders rating.
   *
   * @return {JSX.Element}
   */
  renderRating = () => {
    const {
      product: { item },
    } = this.props;

    return (
      <StarsRating
        value={item.average_rating}
        size={RATING_STAR_SIZE}
        isRatingSelectionDisabled
      />
    );
  };

  /**
   * Renders component
   *
   * @return {JSX.Element}
   */
  render() {
    const { product, onPress } = this.props;
    const { item } = product;
    const imageUri = getImagePath(item);

    return (
      <TouchableOpacity style={styles.container} onPress={() => onPress(item)}>
        <View>
          {imageUri !== null && (
            <Image
              style={styles.productImage}
              source={{ uri: imageUri }}
              resizeMode="contain"
              resizeMethod="resize"
            />
          )}
        </View>
        {this.renderDiscount()}
        <View style={styles.description}>
          <Text numberOfLines={2} style={styles.productName}>
            {item.product}
          </Text>
          {this.renderRating()}
          {this.renderPrice()}
        </View>
      </TouchableOpacity>
    );
  }
}

export default connect((state) => ({
  settings: state.settings,
  auth: state.auth,
}))(ProductListView);
