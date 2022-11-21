import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { get } from 'lodash';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import theme from '../config/theme';

import values from 'lodash/values';
import uniqueId from 'lodash/uniqueId';
import { SHIPPING_TYPE_PICKUP } from '../constants/index';

// Import actions.
import * as cartActions from '../actions/cartActions';
import * as stepsActions from '../actions/stepsActions';

// Components
import StepByStepSwitcher from '../components/StepByStepSwitcher';
import CartFooter from '../components/CartFooter';
import Spinner from '../components/Spinner';
import Icon from '../components/Icon';

import i18n from '../utils/i18n';

import { stripTags, formatPrice, getKeyByValue } from '../utils';
import { Navigation } from 'react-native-navigation';

const FIRST_SHIPPING_INDEX = 0;

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  contentContainer: {},
  shippingItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#F1F1F1',
    backgroundColor: '#fff',
    marginBottom: 6,
  },
  shippingItemText: {
    fontSize: '0.9rem',
    paddingBottom: 6,
    marginLeft: 6,
    marginRight: 6,
  },
  shippingItemDesc: {
    fontSize: '0.8rem',
    paddingBottom: 6,
    color: 'gray',
  },
  shippingTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    marginBottom: 14,
    textAlign: 'center',
  },
  shippingItemRate: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: '1rem',
  },
  shippingItemTitleWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  shippingItemTitle: {
    flex: 1,
    flexDirection: 'row',
  },
  uncheckIcon: {
    fontSize: '1rem',
  },
  checkIcon: {
    fontSize: '1rem',
    opacity: 0.5,
  },
  stepsWrapper: {
    padding: 14,
  },
  shippingForbiddenContainer: {
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
  },
  shippingForbiddenText: {
    textAlign: 'center',
    color: theme.$dangerColor,
  },
  totalWrapper: {
    marginTop: 6,
    marginLeft: 20,
    marginRight: 20,
  },
  totalText: {
    textAlign: 'right',
    marginTop: 4,
    color: '#979797',
  },
  totalDiscountText: {
    textAlign: 'right',
    marginTop: 4,
    color: '$dangerColor',
  },
  pickupPointsWrapper: {
    padding: 10,
    backgroundColor: '#fff',
  },
  pickupPointsTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  pickupPointWrapper: {
    padding: 10,
    borderLeftWidth: 7,
    borderColor: '$mediumGrayColor',
    marginBottom: 10,
  },
  pickupPointWrapperActive: {
    padding: 10,
    borderLeftWidth: 7,
    borderColor: '$successColor',
    marginBottom: 10,
  },
  pickupPointTitleActive: {
    color: '$successColor',
  },
  pickupPointTitle: {
    color: '$darkColor',
  },
  pickupPointText: {
    color: '$mediumGrayColor',
  },
  priceContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

/**
 * Checkout. Shipping screen.
 *
 * @reactProps {object} navigator - Navigator.
 * @reactProps {object} cart - Cart information.
 * @reactProps {object} cartActions - Cart actions.
 */
export class CheckoutShipping extends Component {
  static propTypes = {
    cart: PropTypes.shape({}),
  };

  constructor(props) {
    super(props);

    this.state = {
      total: 0,
      items: [],
      shipping_id: [],
      isNextDisabled: true,
      selectedShippings: {},
    };
  }

  /**
   * Sets shipping methods.
   */
  componentDidMount() {
    const { cart } = this.props;
    this.setDefaults(cart);

    setTimeout(() => this.handleLoadInitial(), 500);
  }

  /**
   * Set default shipping method.
   *
   * @param {object} cart - Cart information.
   */
  setDefaults(cart) {
    const items = this.normalizeData(cart.product_groups);
    const shippings = [];
    let isShippingForbidden = false;

    items.forEach((item) => {
      if (item) {
        item.shippings.forEach((shipping) => {
          shippings.push(shipping);
        });
      }
      if (item.isShippingForbidden) {
        isShippingForbidden = true;
      }
    });

    if (!this.state.items.length) {
      this.setState({
        items,
      });
    }

    const selectedShippings = {};
    Object.keys(cart.product_groups).forEach((productGroupIndex) => {
      // We take current product group
      const productGroup = cart.product_groups[productGroupIndex];

      if (productGroup.shippings.length) {
        // We take a key of the first shipping method inside product_group.shippings object
        const keyOfDefaultShippingMethod = Object.keys(productGroup.shippings)[
          FIRST_SHIPPING_INDEX
        ];
        // Gets shippingId from the first shipping method inside current product_group.shippings object
        const defaultShippingId =
          productGroup.shippings[keyOfDefaultShippingMethod].shipping_id;
        // Gets companyId from the current product_group
        const companyId = productGroup.company_id;
        // Set shippingIds in the format: { cart.product_groups[0].company_id: shipping_id1 }
        selectedShippings[companyId] = defaultShippingId;
      }
    });

    this.setState({
      selectedShippings,
      shipping_id: cart.chosen_shipping,
      total: cart.total_formatted.price,
      isNextDisabled: isShippingForbidden || shippings.length === 0,
    });
  }

  /**
   * Changes data format.
   *
   * @param {object} blobData - Company information.
   */
  normalizeData = (blobData) => {
    const { shipping_id } = this.state;

    return blobData.map((currentItem) => {
      const item = { ...currentItem };
      item.shippings = values(item.shippings);
      item.shippings = item.shippings.map((i, index) => {
        if (index === 0 && !values(shipping_id).length) {
          this.setState({ shipping_id: { 0: i.shipping_id } });
          return {
            ...i,
            isSelected: true,
          };
        }

        return {
          ...i,
          isSelected: values(shipping_id).includes(i.shipping_id),
        };
      });
      return item;
    });
  };

  /**
   * Calculates the cost including delivery.
   */
  handleLoadInitial() {
    const { cartActions, stateCart, cart } = this.props;
    const { items } = this.state;
    const shippingsIds = {};
    const shippings = [];

    items.forEach((item) => {
      if (item) {
        item.shippings.forEach((shipping) => {
          shippings.push(shipping);
        });
      }
    });

    shippings.forEach((shipping, index) => {
      if (shipping.isSelected) {
        shippingsIds[index] = shipping.shipping_id;
      }
    });

    cartActions
      .recalculateTotal(shippingsIds, stateCart.coupons, cart.vendor_id)
      .then((data) => {
        cart.total_formatted = data.total_formatted;
        this.setState({
          total: data.total_formatted.price,
        });
      });
  }

  /**
   * Redirects to CheckoutPayment.
   */
  handleNextPress() {
    const { cart, stepsActions, stateSteps, currentStep } = this.props;
    const { items } = this.state;

    // Transform selected shippings and pickup points.
    const selectedShippings = {};
    const selectedPickupPoints = {};

    items.forEach((item) => {
      item.shippings.forEach((shipping) => {
        if (shipping.isSelected) {
          if (shipping.service_code === SHIPPING_TYPE_PICKUP) {
            shipping.data.stores.forEach((store) => {
              if (store.isSelected) {
                selectedPickupPoints[item.group_key] = {
                  [shipping.shipping_id]: store.store_location_id,
                };
              }
            });
          }

          selectedShippings[item.company_id] = shipping.shipping_id;
        }
      });
    });

    cart.total_formatted.price = this.state.total;

    // Define next step
    const nextStep =
      stateSteps.flowSteps[
        Object.keys(stateSteps.flowSteps)[currentStep.stepNumber + 1]
      ];
    stepsActions.setNextStep(nextStep);

    Navigation.push(this.props.componentId, {
      component: {
        name: nextStep.screenName,
        passProps: {
          selectedShippings: selectedShippings
            ? selectedShippings
            : this.state.selectedShippings,
          selectedPickupPoints,
          cart,
          currentStep: nextStep,
        },
      },
    });
  }

  /**
   * Switches shipping method.
   *
   * @param {object} shipping - Data of chosen shipping method.
   * @param {number} shippingIndex - Index of chosen shipping method.
   * @param {number} itemIndex - Index of the vendor.
   */
  handleSelect(shipping, shippingIndex, itemIndex) {
    const { cartActions, stateCart, cart } = this.props;

    if (shipping.isSelected) {
      return;
    }

    // Remeber the selected shippings for sra_orders request.
    const selectedShippings = JSON.parse(
      JSON.stringify(this.state.selectedShippings),
    );
    const companyId = cart.product_groups[itemIndex].company_id;
    selectedShippings[companyId] = shipping.shipping_id;

    // Choosing shipping
    const newProductGroups = JSON.parse(JSON.stringify(this.state.items));
    newProductGroups[itemIndex].shippings = newProductGroups[
      itemIndex
    ].shippings.map((s) => {
      if (s.isSelected && s.service_code === SHIPPING_TYPE_PICKUP) {
        const newShipping = { ...s, isSelected: false };
        newShipping.data.stores = newShipping.data.stores.map((store) => {
          // Removes canceled pickup points from the cart.
          if (store.isSelected) {
            const shippingId = getKeyByValue(
              cart.pickuppoint_office[newProductGroups[itemIndex].group_key],
              store.store_location_id,
            );

            delete cart.pickuppoint_office[
              newProductGroups[itemIndex].group_key
            ][shippingId];
          }
          return { ...store, isSelected: false };
        });
        return newShipping;
      }
      return { ...s, isSelected: false };
    });

    newProductGroups[itemIndex].shippings[shippingIndex].isSelected = true;

    // Сhecks what type of delivery. If the type is pickup, checks if the pickpoint is selected.
    // If not, then chooses the first option.
    if (
      newProductGroups[itemIndex].shippings[shippingIndex].service_code ===
      SHIPPING_TYPE_PICKUP
    ) {
      const isPickupPointChosen = newProductGroups[itemIndex].shippings[
        shippingIndex
      ].data.stores.map((store) => store.isSelected);

      if (!isPickupPointChosen.includes(true)) {
        newProductGroups[itemIndex].shippings[
          shippingIndex
        ].data.stores[0].isSelected = true;

        this.selectPickupPoint(
          newProductGroups[itemIndex].shippings[shippingIndex].data.stores[0],
          newProductGroups[itemIndex],
          newProductGroups[itemIndex].shippings[shippingIndex],
        );
      }
    }

    // Get selected ids
    let selectedIds = JSON.parse(JSON.stringify(this.state.shipping_id));
    selectedIds[`${itemIndex}`] = `${shipping.shipping_id}`;

    cartActions
      .recalculateTotal(selectedIds, stateCart.coupons, cart.vendor_id)
      .then((data) => {
        cart.total_formatted = data.total_formatted;
        this.setState({
          total: data.total_formatted.price,
        });
      });

    this.setState({
      selectedShippings,
      items: [...newProductGroups],
      shipping_id: selectedIds,
    });
  }

  selectPickupPoint = (pickupPoint, item, shipping) => {
    const { items } = this.state;
    const { cart } = this.props;

    const productGroupId = cart.product_groups
      .map((productGroup) => productGroup.name)
      .indexOf(item.name);

    const shippingIndex = items[productGroupId].shippings
      .map((shipping) => shipping.shipping_id)
      .indexOf(shipping.shipping_id);

    const newItems = [...this.state.items];

    const newPickupPoints = shipping.data.stores.map((store) => {
      if (pickupPoint.store_location_id === store.store_location_id) {
        return { ...store, isSelected: true };
      } else {
        return { ...store, isSelected: false };
      }
    });

    newItems[productGroupId].shippings[shippingIndex].data.stores =
      newPickupPoints;

    this.setState({ items: [...newItems] });

    cart.shippings_extra.data[shipping.group_key][shipping.shipping_id].stores =
      { ...newPickupPoints };

    if (!cart.pickuppoint_office) {
      cart.pickuppoint_office = {};
    }

    cart.pickuppoint_office[item.group_key] = {
      [shipping.shipping_id]: pickupPoint.store_location_id,
    };
  };

  renderPickupPoints = (shipping, item) => {
    return (
      <View style={styles.pickupPointsWrapper}>
        <Text style={styles.pickupPointsTitle}>
          {i18n.t('Select a pickup point')}
        </Text>
        {shipping.data.stores.map((store) => {
          return (
            <TouchableOpacity
              onPress={() => this.selectPickupPoint(store, item, shipping)}
              style={
                store.isSelected
                  ? styles.pickupPointWrapperActive
                  : styles.pickupPointWrapper
              }>
              <Text
                style={
                  store.isSelected
                    ? styles.pickupPointTitleActive
                    : styles.pickupPointTitle
                }>
                {store.name}
              </Text>
              <Text style={styles.pickupPointText}>{store.pickup_address}</Text>
              <Text style={styles.pickupPointText}>{store.pickup_time}</Text>
              <Text style={styles.pickupPointText}>{store.pickup_phone}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  /**
   * Renders shipping options.
   *
   * @param {object} shipping - Shipping method information.
   * @param {number} shippingIndex - Shipping index.
   * @param {number} itemIndex - Index of the selected shipping method.
   *
   * @return {JSX.Element}
   */
  renderItem = (shipping, shippingIndex, itemIndex, item) => {
    const isPickupPoint =
      shipping.service_code === SHIPPING_TYPE_PICKUP && shipping.isSelected;

    return (
      <>
        <TouchableOpacity
          key={uniqueId('item_')}
          style={[styles.shippingItem]}
          onPress={() => this.handleSelect(shipping, shippingIndex, itemIndex)}>
          <View style={styles.shippingItemTitleWrap}>
            <View style={styles.shippingItemTitle}>
              {shipping.isSelected ? (
                <Icon name="radio-button-checked" style={styles.checkIcon} />
              ) : (
                <Icon
                  name="radio-button-unchecked"
                  style={styles.uncheckIcon}
                />
              )}
              <Text style={styles.shippingItemText}>
                {shipping.shipping} {shipping.delivery_time}
              </Text>
            </View>

            <Text style={styles.shippingItemRate}>
              {item.free_shipping && shipping.free_shipping
                ? i18n.t('Free')
                : shipping.rate_formatted.price}
            </Text>
          </View>
          <Text style={styles.shippingItemDesc}>
            {stripTags(shipping.description)}
          </Text>
        </TouchableOpacity>
        {isPickupPoint && this.renderPickupPoints(shipping, item)}
      </>
    );
  };

  /**
   * Renders checkout steps.
   *
   * @return {JSX.Element}
   */
  renderSteps = () => {
    const { currentStep } = this.props;
    return (
      <View style={styles.stepsWrapper}>
        <StepByStepSwitcher currentStep={currentStep} />
      </View>
    );
  };

  /**
   * Renders company title.
   *
   * @param {string} title - Company title.
   *
   * @return {JSX.Element}
   */
  renderCompany = (title) => {
    const { items } = this.state;
    if (items.length === 1) {
      return null;
    }
    return <Text style={styles.shippingTitle}>{title}</Text>;
  };

  /**
   * Renders shipping not available message.
   *
   * @return {JSX.Element}
   */
  renderShippingNotAvailableMessage = () => {
    return (
      <View style={styles.shippingForbiddenContainer}>
        <Text style={styles.shippingForbiddenText}>
          {i18n.t(
            'Sorry, it seems that we have no shipping options available for your location.Please check your shipping address and contact us if everything is okay. We`ll see what we can do about it.',
          )}
        </Text>
      </View>
    );
  };

  /**
   * Renders order detail.
   *
   * @return {JSX.Element}
   */
  renderOrderDetail = () => {
    const { cart, stateCart } = this.props;

    const currentCart = stateCart.carts.general
      ? stateCart.carts.general
      : stateCart.carts[cart.vendor_id];

    const isFormattedDiscount = !!get(currentCart, 'subtotal_discount', '');
    const formattedDiscount = get(
      currentCart,
      'subtotal_discount_formatted.price',
      '',
    );
    const isIncludingDiscount = !!get(currentCart, 'discount', '');
    const includingDiscount = get(currentCart, 'discount_formatted.price', '');

    return (
      <View style={styles.totalWrapper}>
        <View style={styles.priceContainer}>
          <Text style={styles.totalText}>{`${i18n.t('Subtotal')}: `}</Text>
          <Text style={styles.totalText}>
            {formatPrice(get(currentCart, 'subtotal_formatted.price', ''))}
          </Text>
        </View>
        {isIncludingDiscount && (
          <View style={styles.priceContainer}>
            <Text style={styles.totalDiscountText}>{`${i18n.t(
              'Including discount',
            )}: -`}</Text>
            <Text style={styles.totalDiscountText}>
              {formatPrice(includingDiscount)}
            </Text>
          </View>
        )}
        {isFormattedDiscount && (
          <View style={styles.priceContainer}>
            <Text style={styles.totalDiscountText}>{`${i18n.t(
              'Order discount',
            )}: -`}</Text>
            <Text style={styles.totalDiscountText}>
              {formatPrice(formattedDiscount)}
            </Text>
          </View>
        )}
        <View style={styles.priceContainer}>
          <Text style={styles.totalText}>{`${i18n.t('Shipping')}: `}</Text>
          <Text style={styles.totalText}>
            {formatPrice(get(currentCart, 'shipping_cost_formatted.price', ''))}
          </Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.totalText}>{`${i18n.t('Taxes')}: `}</Text>
          <Text style={styles.totalText}>
            {formatPrice(get(currentCart, 'tax_subtotal_formatted.price', ''))}
          </Text>
        </View>
      </View>
    );
  };

  /**
   * Renders component
   *
   * @return {JSX.Element}
   */
  render() {
    const { items, isNextDisabled, total } = this.state;
    const { stateCart } = this.props;

    if (stateCart.fetching) {
      return <Spinner visible />;
    }

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {this.renderSteps()}
          {items
            .filter(
              (item) => item.isShippingRequired || !item.shipping_no_required,
            )
            .map((item, itemIndex) => (
              <View key={item.company_id}>
                {this.renderCompany(item.name)}
                {item.isShippingForbidden || !item.shippings.length
                  ? this.renderShippingNotAvailableMessage()
                  : item.shippings.map((shipping, shippingIndex) =>
                      this.renderItem(shipping, shippingIndex, itemIndex, item),
                    )}
              </View>
            ))}
          {this.renderOrderDetail()}
        </ScrollView>
        <CartFooter
          totalPrice={`${formatPrice(total)}`}
          btnText={i18n.t('Next').toUpperCase()}
          isBtnDisabled={isNextDisabled}
          onBtnPress={() => this.handleNextPress()}
        />
      </SafeAreaView>
    );
  }
}

export default connect(
  (state) => ({
    stateCart: state.cart,
    shippings: state.shippings,
    stateSteps: state.steps,
  }),
  (dispatch) => ({
    cartActions: bindActionCreators(cartActions, dispatch),
    stepsActions: bindActionCreators(stepsActions, dispatch),
  }),
)(CheckoutShipping);
