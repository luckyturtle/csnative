import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Navigation } from 'react-native-navigation';
import * as nav from '../services/navigation';
import { iconsMap } from '../utils/navIcons';
import { toInteger, get } from 'lodash';
import i18n from '../utils/i18n';
import { isEmpty } from 'lodash';
import config from '../config';
import theme from '../config/theme';
import { formatPrice, isPriceIncludesTax, stripTags } from '../utils';
import {
  VERSION_MVE,
  OPTION_TYPE_CHECKBOX,
  OPTION_TYPE_TEXT,
  OPTION_TYPE_TEXT_AREA,
  OPTION_IS_REQUIRED,
  BUY_IN_ADVANCE,
} from '../constants';
import store from '../store';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Platform,
  Share,
} from 'react-native';

// Import actions.
import * as productsActions from '../actions/productsActions';
import * as wishListActions from '../actions/wishListActions';
import * as cartActions from '../actions/cartActions';
import * as vendorActions from '../actions/vendorActions';

// Components
import { ProductFeaturesList } from '../components/ProductFeaturesList';
import { ProductDetailOptions } from '../components/ProductDetailOptions';
import ProductImageSwiper from '../components/ProductImageSwiper';
import { AddToCartButton } from '../components/AddToCartButton';
import DiscussionList from '../components/DiscussionList';
import StarsRating from '../components/StarsRating';
import ReviewsBlock from '../components/ReviewsBlock';
import InAppPayment from '../components/InAppPayment';
import { QtyOption } from '../components/QtyOption';
import { Seller } from '../components/Seller';
import Section from '../components/Section';
import Spinner from '../components/Spinner';
import DetailDescription from '../components/DetailDescription';
import { QuantityDiscounts } from '../components/QuantityDiscounts';

const RATING_STAR_SIZE = 14;
const PRODUCT_IS_DOWNLOADABLE = 'Y';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '$containerPadding',
  },
  descriptionBlock: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  nameText: {
    fontSize: '1.1rem',
    color: '$darkColor',
    marginBottom: 5,
    textAlign: 'left',
  },
  starsRatingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingCountText: {
    color: '#8F8F8F',
    marginLeft: 10,
  },
  priceText: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '$darkColor',
    textAlign: 'left',
  },
  smallText: {
    fontSize: '0.8rem',
    fontWeight: 'normal',
    color: '$darkColor',
  },
  outOfStockText: {
    color: '$dangerColor',
    fontSize: '1rem',
    fontWeight: '500',
  },
  priceWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexWrap: 'wrap',
  },
  listPriceText: {
    textDecorationLine: 'line-through',
    textDecorationColor: 'red',
    color: '$darkColor',
    textAlign: 'left',
    marginLeft: 10,
  },
  listPriceWrapperText: {
    textAlign: 'left',
  },
  promoText: {
    marginBottom: 10,
  },
  descText: {
    color: '$discussionMessageColor',
    textAlign: 'justify',
  },
  addToCartContainerWrapper: {
    shadowColor: '#45403a',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderTopWidth: Platform.OS === 'android' ? 1 : null,
    borderColor: '#d9d9d9',
  },
  addToCartContainer: {
    padding: 14,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wrapperStyle: {
    padding: 0,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 20,
  },
  sectionBtn: {
    paddingTop: 12,
    paddingBottom: 6,
  },
  sectionBtnText: {
    color: '$buttonWithoutBackgroundTextColor',
    fontSize: '0.9rem',
    textAlign: 'left',
    maxWidth: 100,
  },
  vendorWrapper: {
    paddingTop: 8,
    paddingBottom: 8,
    marginBottom: 10,
  },
  vendorName: {
    fontSize: '0.9rem',
    textAlign: 'left',
    marginRight: 100,
  },
  vendorProductCount: {
    fontSize: '0.7rem',
    color: 'gray',
    marginBottom: 13,
    textAlign: 'left',
  },
  vendorDescription: {
    color: 'gray',
    textAlign: 'left',
  },
  rating: {
    marginLeft: -10,
    marginRight: -10,
    marginBottom: 5,
  },
  keyboardAvoidingContainer: {
    marginBottom: Platform.OS === 'ios' ? 122 : 132,
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
    borderRadius: 2,
  },
  listDiscountText: {
    color: '#fff',
  },
  inAppPaymentWrapper: {
    flex: 2,
    marginRight: 10,
  },
  zeroPrice: {
    paddingTop: 10,
  },
  minQtyNoticeText: {
    color: '$mediumGrayColor',
    marginBottom: 10,
  },
});

/**
 * Renders product detail screen.
 *
 * @param {number} pid - Product id.
 * @param {object} productsActions - Products actions.
 * @param {object} wishListActions - Wishlist actions.
 * @param {object} vendorActions - Vendor actions.
 * @param {object} cartActions - Cart actions.
 * @param {object} discussion - Discussion store data.
 * @param {string} componentId - Component id.
 * @param {object} auth - Auth store data.
 * @param {boolean} hideWishList - Hide wishlist or not flag.
 * @param {object} wishList - Wishlist store data.
 *
 * @return {JSX.Element}
 */
export const ProductDetail = ({
  pid,
  productsActions,
  wishListActions,
  vendorActions,
  cartActions,
  discussion,
  componentId,
  auth,
  hideWishList,
  wishList,
  cart,
  settings,
}) => {
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState(1);
  const [vendor, setVendor] = useState(null);

  const listener = {
    navigationButtonPressed: ({ buttonId }) => {
      if (buttonId === 'wishlist') {
        handleAddToWishList();
      }

      if (buttonId === 'share') {
        handleShare();
      }
    },
  };

  const fetchData = async (currentPid) => {
    const currentProduct = await productsActions.fetch(currentPid);
    const currentVendor = await vendorActions.fetch(currentProduct.company_id);
    const step = parseInt(currentProduct.qty_step, 10) || 1;
    setAmount(step);
    setVendor(currentVendor);
    setProduct(currentProduct);
  };

  useEffect(() => {
    fetchData(pid);
  }, []);

  useEffect(() => {
    if (product) {
      const setTopBarOptions = (product) => {
        const topBar = {
          title: {
            text: product.product,
          },
        };

        const state = store.getState();

        topBar.rightButtons = [
          {
            id: 'share',
            icon: iconsMap.share,
          },
        ];

        if (
          !hideWishList &&
          !product.isProductOffer &&
          state.settings.wishlistAddon.isEnabled
        ) {
          const wishListActive = wishList.items.some(
            (item) => parseInt(item.product_id, 10) === product.product_id,
          );
          topBar.rightButtons.push({
            id: 'wishlist',
            icon: iconsMap.favorite,
            color: wishListActive
              ? theme.$buttonWithoutBackgroundTextColor
              : theme.$navBarButtonColor,
          });
        }

        Navigation.mergeOptions(componentId, {
          topBar,
        });
      };

      setTopBarOptions(product);
    }

    const listeners = Navigation.events().registerComponentListener(
      listener,
      componentId,
    );

    return () => {
      listeners.remove();
    };
  }, [componentId, listener, product, hideWishList, wishList]);

  /**
   * Changes variations.
   *
   * @param {string} variantId - Variation id.
   * @param {string} variantOption - Selected variatoin data.
   */
  const changeVariationHandler = async (variantId, variantOption) => {
    const selectedVariationPid = variantOption.product_id;
    const currnetVariationPid = product.selectedVariants[variantId].product_id;

    if (currnetVariationPid === selectedVariationPid) {
      return null;
    }

    fetchData(selectedVariationPid);
  };

  /**
   * Changes options.
   *
   * @param {string} optionId - Option id.
   * @param {string} selectedOptionValue - Selected option data.
   */
  const changeOptionHandler = async (optionId, selectedOptionValue) => {
    let selectedOptionValueCopy = { ...selectedOptionValue };
    const CHECKBOX_VALUE_NO = '0';

    // If user changes required checkbox from Yes to No, sets value to required.
    if (
      product.product_options[optionId].required === 'Y' &&
      product.product_options[optionId].option_type === OPTION_TYPE_CHECKBOX &&
      selectedOptionValueCopy.position === CHECKBOX_VALUE_NO
    ) {
      selectedOptionValueCopy.variant_id = OPTION_IS_REQUIRED;
    }

    const newOptions = { ...product.selectedOptions };
    const optionType = product.product_options[optionId].option_type;
    if (
      optionType === OPTION_TYPE_TEXT ||
      optionType === OPTION_TYPE_TEXT_AREA
    ) {
      newOptions[optionId] = selectedOptionValue;
    } else {
      newOptions[optionId] = selectedOptionValueCopy;
    }
    const recalculatedProduct = await productsActions.recalculatePrice(
      product.product_id,
      newOptions,
    );
    setProduct({ ...recalculatedProduct });
  };

  /**
   * Renders variations and options block.
   *
   * @return {JSX.Element}
   */
  const renderVariationsAndOptions = () => {
    if (isEmpty(product.selectedOptions) && isEmpty(product.selectedVariants)) {
      return null;
    }

    return (
      <Section
        title={i18n.t('Select')}
        wrapperStyle={styles.wrapperStyle}
        topDivider>
        <ProductDetailOptions
          options={product.convertedVariants}
          selectedOptions={product.selectedVariants}
          changeOptionHandler={changeVariationHandler}
        />
        <ProductDetailOptions
          options={product.convertedOptions}
          selectedOptions={product.selectedOptions}
          changeOptionHandler={changeOptionHandler}
        />
      </Section>
    );
  };

  /**
   * Renders discount label.
   *
   * @return {JSX.Element}
   */
  const renderDiscountLabel = () => {
    if (!product.list_discount_prc && !product.discount_prc) {
      return null;
    }

    const discount = product.list_discount_prc || product.discount_prc;

    return (
      <View style={styles.listDiscountWrapper}>
        <Text style={styles.listDiscountText}>
          {`${i18n.t('Discount')} ${discount}%`}
        </Text>
      </View>
    );
  };

  /**
   * Renders main images of the product.
   *
   * @return {JSX.Element}
   */
  const renderImage = () => {
    return (
      <View>
        <ProductImageSwiper>{product.images}</ProductImageSwiper>
        {renderDiscountLabel()}
      </View>
    );
  };

  /**
   * Renders a name of the product.
   *
   * @return {JSX.Element}
   */
  const renderName = () => {
    return <Text style={styles.nameText}>{product.product}</Text>;
  };

  /**
   * Renders rating.
   *
   * @return {JSX.Element}
   */
  const renderRating = () => {
    let ratingValue;
    let reviewCount;

    if (settings.productReviewsAddon?.isEnabled) {
      ratingValue = product.average_rating;
      reviewCount = product.product_reviews_count;
    } else {
      const activeDiscussion = discussion.items[`p_${product.product_id}`];
      ratingValue = activeDiscussion?.average_rating;
      reviewCount = activeDiscussion?.posts.length;
    }

    if (!ratingValue) {
      return null;
    }

    return (
      <View style={styles.starsRatingWrapper}>
        <StarsRating
          size={RATING_STAR_SIZE}
          value={Number(ratingValue)}
          isRatingSelectionDisabled
        />
        <Text style={styles.ratingCountText}>
          {reviewCount} {i18n.t('reviews')}
        </Text>
      </View>
    );
  };

  /**
   * Renders price.
   *
   * @return {JSX.Element}
   */
  const renderPrice = () => {
    let discountPrice = null;
    let showDiscount = false;

    if (product.list_discount_prc && product.discount_prc) {
      discountPrice = product.base_price_formatted.price;
      showDiscount = true;
    } else if (
      toInteger(product.list_price) &&
      toInteger(product.list_price) !== toInteger(product.base_price)
    ) {
      discountPrice = product.list_price_formatted.price;
      showDiscount = true;
    }

    const outOfStock =
      !Number(product.amount) && product.is_edp !== PRODUCT_IS_DOWNLOADABLE;
    const isProductPriceZero = Math.ceil(product.price) !== 0;
    const productTaxedPrice = get(product, 'taxed_price_formatted.price', '');
    const productPrice =
      productTaxedPrice || get(product, 'price_formatted.price', '');
    const showTaxedPrice = isPriceIncludesTax(product);

    if (outOfStock) {
      return (
        <Text style={styles.outOfStockText}>{i18n.t('Out of stock')}</Text>
      );
    }

    return (
      <View style={styles.priceWrapper}>
        <View style={styles.priceContainer}>
          {isProductPriceZero ? (
            <Text style={styles.priceText}>
              {formatPrice(productPrice)}
              {showTaxedPrice && (
                <Text style={styles.smallText}>
                  {` (${i18n.t('Including tax')})`}
                </Text>
              )}
            </Text>
          ) : (
            <Text style={styles.zeroPrice}>
              {i18n.t('Contact us for a price')}
            </Text>
          )}
          {showDiscount && isProductPriceZero && (
            <Text style={styles.listPriceText}>
              {formatPrice(discountPrice)}
            </Text>
          )}
        </View>
      </View>
    );
  };

  /**
   * Renders description block.
   *
   * @return {JSX.Element}
   */
  const renderDesc = () => {
    if (!product.full_description) {
      return null;
    }

    return (
      <Section
        title={i18n.t('Description')}
        wrapperStyle={styles.wrapperStyle}
        topDivider>
        <DetailDescription
          description={product.full_description}
          id={product.product_id}
          title={product.product}
        />
      </Section>
    );
  };

  /**
   * Renders quantity switcher.
   *
   * @return {JSX.Element}
   */
  const renderQuantitySwitcher = () => {
    const step = parseInt(product.qty_step, 10) || 1;
    const max = parseInt(product.max_qty, 10) || parseInt(product.amount, 10);
    const min = parseInt(product.min_qty, 10) || step;

    if (product.isProductOffer) {
      return null;
    }

    if (amount < min) {
      setAmount(min);
    }

    return (
      <>
        <QtyOption
          max={max}
          min={min}
          initialValue={amount || min}
          step={step}
          onChange={(val) => {
            setAmount(val);
          }}
        />
        {min > 1 && (
          <Text style={styles.minQtyNoticeText}>
            {i18n.t(
              'Minimum quantity for "{{productTitle}}" is {{minProductQty}}.',
              { productTitle: product.product, minProductQty: min },
            )}
          </Text>
        )}
      </>
    );
  };

  const renderNewDiscussion = () => {
    const title = i18n.t('Reviews');

    return (
      <Section
        title={title}
        topDivider
        wrapperStyle={styles.wrapperStyle}
        showRightButton={true}
        rightButtonText={i18n.t('Write a Review')}
        onRightButtonPress={() => {
          nav.showModalWriteReviewNew({
            discussionType: 'P',
            productId: product.product_id,
            fetchData,
          });
        }}>
        <ReviewsBlock
          componentId={componentId}
          productId={product.product_id}
          productReviews={product.product_reviews}
          fetchData={fetchData}
        />
      </Section>
    );
  };

  const renderOldDiscussion = () => {
    let activeDiscussion = discussion.items[`p_${product.product_id}`];
    const masMore = activeDiscussion.search.total_items > 2;
    const title = i18n.t('Reviews');

    return (
      <Section
        title={title}
        topDivider
        wrapperStyle={styles.wrapperStyle}
        showRightButton={true}
        rightButtonText={i18n.t('Write a Review')}
        onRightButtonPress={() => {
          nav.pushWriteReview(componentId, {
            activeDiscussion,
            discussionType: 'P',
            discussionId: product.product_id,
          });
        }}>
        <DiscussionList
          items={activeDiscussion.posts.slice(0, 2)}
          type={activeDiscussion.type}
        />
        {masMore && (
          <TouchableOpacity
            style={styles.sectionBtn}
            onPress={() => {
              nav.showDiscussion({
                componentId,
                productId: product.product_id,
              });
            }}>
            <Text style={styles.sectionBtnText}>{i18n.t('View All')}</Text>
          </TouchableOpacity>
        )}
      </Section>
    );
  };

  /**
   * Renders descussion block.
   *
   * @return {JSX.Element}
   */
  const renderDiscussion = () => {
    if (product.rating && !settings.productReviewsAddon?.isEnabled) {
      return renderOldDiscussion();
    }

    if (settings.productReviewsAddon?.isEnabled) {
      return renderNewDiscussion();
    }

    return null;
  };

  /**
   * Share function.
   */
  const handleShare = () => {
    const url = `${config.siteUrl}index.php?dispatch=products.view&product_id=${product.product_id}`;
    Share.share(
      {
        message: url,
        title: product.product,
        url,
      },
      {
        dialogTitle: product.product,
        tintColor: 'black',
      },
    );
  };

  /**
   * Add to whishlist function.
   */
  const handleAddToWishList = (productOffer) => {
    const productOptions = {};

    const currentProduct = productOffer || product;

    if (!auth.logged) {
      return nav.showLogin();
    }

    if (
      typeof currentProduct.selectedOptions === 'object' &&
      currentProduct.selectedOptions !== null
    ) {
      // Convert product options to the option_id: variant_id array.
      Object.keys(currentProduct.selectedOptions).forEach((k) => {
        productOptions[k] = currentProduct.selectedOptions[k];
        if (currentProduct.selectedOptions[k].variant_id) {
          productOptions[k] = currentProduct.selectedOptions[k].variant_id;
        }
      });
    }

    const products = {
      [currentProduct.product_id]: {
        product_id: currentProduct.product_id,
        amount: currentProduct.selectedAmount || 1,
        product_options: productOptions,
      },
    };

    return wishListActions.add({ products }, componentId);
  };

  /**
   * Renders vendor information.
   *
   * @return {JSX.Element}
   */
  const renderVendorInfo = () => {
    if (config.version !== VERSION_MVE || !vendor || product.isProductOffer || !vendor.is_display_vendor) {
      return null;
    }

    return (
      <Section
        title={i18n.t('Vendor')}
        wrapperStyle={styles.wrapperStyle}
        topDivider
        showRightButton={true}
        rightButtonText={i18n.t('Details')}
        onRightButtonPress={() => {
          nav.showModalVendorDetail({
            vendorId: vendor.company_id,
          });
        }}>
        <View style={styles.vendorWrapper}>
          <Text style={styles.vendorName}>{vendor.company}</Text>
          <Text style={styles.vendorProductCount}>
            {i18n.t('{{count}} item(s)', { count: vendor.products_count })}
          </Text>
          <Text style={styles.vendorDescription}>
            {stripTags(vendor.description)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.sectionBtn}
          onPress={() => {
            nav.showModalVendor({
              companyId: vendor.company_id,
            });
          }}>
          <Text style={styles.sectionBtnText}>{i18n.t('Go To Store')}</Text>
        </TouchableOpacity>
      </Section>
    );
  };

  /**
   * Renders sellers if common products for vendor is turn on.
   *
   * @return {JSX.Element}
   */
  const renderSellers = () => {
    if (!product.isProductOffer) {
      return null;
    }

    return (
      <Section
        title={i18n.t('Sellers')}
        wrapperStyle={styles.wrapperStyle}
        topDivider>
        {product.productOffers.products.map((el, index) => {
          return (
            <Seller
              productOffer={el}
              handleAddToWishList={() => handleAddToWishList(el)}
              isLastVendor={product.productOffers.products.length - 1 === index}
              key={index}
              onPress={() => handleAddToCart(true, el)}
            />
          );
        })}
      </Section>
    );
  };

  /**
   * Add to cart function.
   *
   * @param {boolean} showNotification - Show notification or not.
   * @param {object} productOffer - Selected product offer data.
   */
  const handleAddToCart = (showNotification = true, productOffer) => {
    const productOptions = {};

    if (!auth.logged) {
      return nav.showLogin();
    }

    const currentProduct = productOffer || product;

    // Convert product options to the option_id: variant_id array.
    Object.keys(product.selectedOptions).forEach((k) => {
      productOptions[k] = product.selectedOptions[k];

      if (product.selectedOptions[k].variant_id) {
        productOptions[k] = product.selectedOptions[k].variant_id;
      }

      const currentOption = product.convertedOptions.find(
        (option) => option.option_id === k,
      );

      // If an option is a text, required and doesn't have value, changes value to 'required'
      if (
        (currentOption.option_type === OPTION_TYPE_TEXT ||
          currentOption.option_type === OPTION_TYPE_TEXT_AREA) &&
        currentOption.required === 'Y' &&
        productOptions[k] === ''
      ) {
        productOptions[k] = OPTION_IS_REQUIRED;
      }
    });

    const products = {
      [currentProduct.product_id]: {
        product_id: currentProduct.product_id,
        amount,
        product_options: productOptions,
      },
    };

    let requiredOptionWithoutValue = [];

    // Determines is there a product with required option but without value
    Object.keys(products).forEach((product) => {
      requiredOptionWithoutValue = Object.keys(
        products[product].product_options,
      ).filter((key) => {
        if (products[product].product_options[key] === OPTION_IS_REQUIRED) {
          return key;
        }
      });
    });

    if (requiredOptionWithoutValue.length) {
      productsActions.showRequiredOptionNotification();
      const newProduct = { ...product };
      newProduct.convertedOptions = newProduct.convertedOptions.map(
        (option) => {
          if (requiredOptionWithoutValue.includes(option.option_id)) {
            return { ...option, requiredOptionWarning: true };
          }

          return { ...option };
        },
      );

      setProduct(newProduct);
      return;
    }

    return cartActions.add({ products }, showNotification, cart.coupons);
  };

  /**
   * Renders add to cart block.
   *
   * @return {JSX.Element}
   */
  const renderAddToCart = () => {
    const canPayWithApplePay = Platform.OS === 'ios' && config.applePay;

    const outOfStock =
      !Number(product.amount) && product.is_edp !== PRODUCT_IS_DOWNLOADABLE;
    const isHidePrice =
      settings.checkout.allowAnonymousShopping ===
        'hide_price_and_add_to_cart' && !auth.logged;
    const isHidePaymentButton =
      settings.checkout.allowAnonymousShopping !== 'allow_shopping';

    if (product.isProductOffer) {
      return null;
    }

    const outOfStockAction = product.out_of_stock_actions;

    return (
      <View style={styles.addToCartContainerWrapper}>
        <View style={styles.addToCartContainer}>
          {canPayWithApplePay && (
            <View style={styles.inAppPaymentWrapper}>
              <InAppPayment onPress={this.handleApplePay} />
            </View>
          )}
          {isHidePaymentButton && !auth.logged ? (
            <AddToCartButton
              onPress={() => handleAddToCart()}
              title={'Please sign in to buy'}
            />
          ) : (
            (!outOfStock || outOfStockAction === BUY_IN_ADVANCE) && (
              <AddToCartButton
                onPress={() => handleAddToCart()}
                title={'Add to cart'}
              />
            )
          )}
          {!isHidePrice && renderPrice()}
        </View>
      </View>
    );
  };

  if (!product) {
    return <Spinner visible={true} />;
  }

  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          {renderImage()}
          <View style={styles.descriptionBlock}>
            {renderName()}
            {renderRating()}
          </View>
          {renderQuantitySwitcher()}
          {renderVariationsAndOptions()}
          {renderSellers()}
          {renderDesc()}
          <ProductFeaturesList productFeatures={product.product_features} />
          <QuantityDiscounts prices={product.prices} />
          {renderDiscussion()}
          {renderVendorInfo()}
        </ScrollView>
      </View>
      {renderAddToCart()}
    </>
  );
};

export default connect(
  (state) => ({
    settings: state.settings,
    discussion: state.discussion,
    auth: state.auth,
    cart: state.cart,
    wishList: state.wishList,
  }),
  (dispatch) => ({
    cartActions: bindActionCreators(cartActions, dispatch),
    productsActions: bindActionCreators(productsActions, dispatch),
    wishListActions: bindActionCreators(wishListActions, dispatch),
    vendorActions: bindActionCreators(vendorActions, dispatch),
  }),
)(ProductDetail);
