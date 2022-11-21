import { Dispatch } from 'redux';
import {
  Coupons,
  CartActionTypes,
  ProductGroup,
  Cart,
  UserData,
  Product,
} from '../reducers/cartTypes';
import {
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAIL,
  CART_CHANGE_REQUEST,
  CART_CHANGE_SUCCESS,
  CART_CHANGE_FAIL,
  CART_CONTENT_SAVE_REQUEST,
  CART_CONTENT_SAVE_SUCCESS,
  CART_CONTENT_SAVE_FAIL,
  NOTIFICATION_SHOW,
  CART_SUCCESS,
  CART_FAIL,
  CHANGE_AMOUNT,
  CART_LOADING,
  CART_LOADED,
  CART_REMOVE_REQUEST,
  CART_REMOVE_SUCCESS,
  CART_REMOVE_FAIL,
  CART_CLEAR_REQUEST,
  CART_CLEAR_SUCCESS,
  CART_CLEAR_FAIL,
  CART_RECALCULATE_REQUEST,
  CART_RECALCULATE_SUCCESS,
  CART_RECALCULATE_FAIL,
  CART_ADD_COUPON_CODE,
  CART_REMOVE_COUPON_CODE,
  CART_ADD_COUPON_CODE_FAILED,
} from '../constants';

// links
import i18n from '../utils/i18n';
import Api from '../services/api';
import { getPaymentId } from '../utils/index';

// Gets all applied coupons from all carts.
const getAllAppliedCoupons = (coupons: Coupons) => {
  return Object.keys(coupons).reduce((accumulator, cartId) => {
    return accumulator.concat(Object.keys(coupons[cartId]));
  }, []);
};

export function fetch(calculateShipping = 'A', coupons: Coupons) {
  let appliedCoupons: string[] = [];
  if (coupons) {
    const allAppliedCoupons = getAllAppliedCoupons(coupons);

    appliedCoupons = coupons.general
      ? Object.keys(coupons.general)
      : allAppliedCoupons;
  }

  return async (dispatch: Dispatch<CartActionTypes>) => {
    try {
      dispatch({
        type: CART_LOADING,
      });
      const res = await Api.get('/sra_cart_content', {
        params: {
          calculate_shipping: calculateShipping,
          coupon_codes: appliedCoupons,
        },
      });

      // Removing duplicate shipping.
      res.data.product_groups = res.data.product_groups.filter(
        (product_group: ProductGroup) => !product_group.shipping_by_marketplace,
      );

      const carts: { [key: string]: Cart } = {};
      if (!res.data.amount) {
        dispatch({
          type: CART_CLEAR_SUCCESS,
        });
      } else if (res.data.all_vendor_ids) {
        Object.keys(res.data.payments).forEach((key) => {
          res.data.payments[key].payment_id = key;
        });
        carts[res.data.vendor_id] = res.data;
        const uniqueVendorIds = res.data.all_vendor_ids.filter(
          (el: string) => el !== res.data.vendor_id && !!el,
        );
        dispatch({
          type: CART_LOADING,
        });
        const result: { data: Cart }[] = await Promise.all(
          uniqueVendorIds.map(async (el: string) => {
            const currentCartCoupons = coupons[el]
              ? Object.keys(coupons[el])
              : [];

            const res = await Api.get(`/sra_cart_content/${el}`, {
              params: {
                calculate_shipping: calculateShipping,
                coupon_codes: currentCartCoupons,
              },
            });
            return getPaymentId(res);
          }),
        );

        for (let i = 0; i < result.length; i += 1) {
          if (result[i].data.vendor_id) {
            carts[result[i].data.vendor_id] = result[i].data;
          }
        }
        dispatch({
          type: CART_SUCCESS,
          payload: { carts, isSeparateCart: true },
        });
      } else if (res.data.amount) {
        getPaymentId(res);
        carts.general = res.data;
        dispatch({
          type: CART_SUCCESS,
          payload: { carts, isSeparateCart: false },
        });
      }
      dispatch({
        type: CART_LOADED,
      });
    } catch (error) {
      dispatch({
        type: CART_FAIL,
        error,
      });
    }
  };
}

export function recalculateTotal(
  ids: number[],
  coupons: Coupons = {},
  cartId: string = '',
) {
  const shippingIds = Object.values(ids);

  let appliedCoupons: string[] = [];
  if (coupons) {
    const allAppliedCoupons = getAllAppliedCoupons(coupons);

    appliedCoupons = coupons.general
      ? Object.keys(coupons.general)
      : allAppliedCoupons;
  }

  return (dispatch: Dispatch<CartActionTypes>) => {
    dispatch({
      type: CART_RECALCULATE_REQUEST,
    });
    return Api.get(`/sra_cart_content/${cartId}`, {
      params: {
        shipping_ids: shippingIds,
        calculate_shipping: 'E',
        coupon_codes: appliedCoupons,
      },
    })
      .then((response) => {
        getPaymentId(response);
        dispatch({
          type: CART_RECALCULATE_SUCCESS,
          payload: { cart: response.data, cartId },
        });

        return response.data;
      })
      .catch((error) => {
        dispatch({
          type: CART_RECALCULATE_FAIL,
          error,
        });
      });
  };
}

export function saveUserData(data: UserData, coupons: Coupons) {
  let appliedCoupons: string[] = [];
  if (coupons) {
    const allAppliedCoupons = getAllAppliedCoupons(coupons);

    appliedCoupons = coupons.general
      ? Object.keys(coupons.general)
      : allAppliedCoupons;
  }

  return (dispatch: Dispatch<CartActionTypes>) => {
    dispatch({
      type: CART_CONTENT_SAVE_REQUEST,
      payload: data,
    });
    return Api.put('/sra_cart_content/', {
      user_data: data,
      params: { coupon_codes: appliedCoupons },
    })
      .then(() => {
        dispatch({
          type: CART_CONTENT_SAVE_SUCCESS,
          payload: data,
        });
        fetch(undefined, coupons)(dispatch);
      })
      .catch((error) => {
        dispatch({
          type: CART_CONTENT_SAVE_FAIL,
          error,
        });
      });
  };
}

export function getUpdatedDetailsForShippingAddress(data: UserData) {
  return () =>
    Api.put('/sra_cart_content/', { user_data: data })
      .then(() =>
        Api.get('/sra_cart_content/', { params: { calculate_shipping: 'A' } }),
      )
      .then((response) => response.data)
      .catch((error) => error);
}

export function getUpdatedDetailsForShippingOption(ids) {
  return () =>
    Api.get('/sra_cart_content/', {
      params: { shipping_ids: ids, calculate_shipping: 'E' },
    })
      .then((response) => response.data)
      .catch((error) => error);
}

export function add(
  data: { [key: number]: Product },
  notify = true,
  coupons: Coupons,
) {
  let appliedCoupons: string[] = [];
  if (coupons) {
    const allAppliedCoupons = getAllAppliedCoupons(coupons);

    appliedCoupons = coupons.general
      ? Object.keys(coupons.general)
      : allAppliedCoupons;
  }

  return (dispatch: Dispatch<CartActionTypes>) => {
    dispatch({ type: ADD_TO_CART_REQUEST });
    return Api.post('/sra_cart_content/', {
      ...data,
      params: { coupon_codes: appliedCoupons },
    })
      .then(() => {
        dispatch({
          type: ADD_TO_CART_SUCCESS,
        });
        if (notify) {
          dispatch({
            type: NOTIFICATION_SHOW,
            payload: {
              type: 'success',
              title: i18n.t('Success'),
              text: i18n.t('The product was added to your cart.'),
            },
          });
        }
      })
      .then(() => fetch(undefined, coupons)(dispatch))
      .catch((error) => {
        // Out of stock error
        if (error.response.data.status === 409) {
          dispatch({
            type: NOTIFICATION_SHOW,
            payload: {
              type: 'warning',
              title: i18n.t('Notice'),
              text: i18n.t(
                'Product has zero inventory and cannot be added to the cart.',
              ),
            },
          });
        }
        dispatch({
          type: ADD_TO_CART_FAIL,
          error,
        });
        return error.response;
      });
  };
}

async function deleteProduct(
  resolve: Function,
  ids: string[],
  index: number,
  appliedCoupons: string[],
) {
  const idNumber = Number(ids[index]);
  await Api.delete(`/sra_cart_content/${idNumber}/`, {
    params: { coupon_codes: appliedCoupons },
  });
  const newIndex = index + 1;
  if (newIndex === ids.length) {
    resolve();
  } else {
    deleteProduct(resolve, ids, newIndex, appliedCoupons);
  }
}

async function deleteProducts(ids: string[], appliedCoupons: string[]) {
  return new Promise((resolve) => {
    deleteProduct(resolve, ids, 0, appliedCoupons);
  });
}

export function clear(cart: Cart, coupons: Coupons = {}) {
  let appliedCoupons: string[] = [];
  if (coupons) {
    const allAppliedCoupons = getAllAppliedCoupons(coupons);

    appliedCoupons = coupons.general
      ? Object.keys(coupons.general)
      : allAppliedCoupons;
  }

  return async (dispatch: Dispatch<CartActionTypes>) => {
    try {
      if (cart?.vendor_id) {
        dispatch({ type: CART_CLEAR_REQUEST });
        const productIds = Object.keys(cart.products);
        await deleteProducts(productIds, appliedCoupons);
        await fetch(undefined, coupons)(dispatch);
      } else {
        await dispatch({ type: CART_CLEAR_REQUEST });
        await Api.delete('/sra_cart_content/', {
          params: { coupon_codes: appliedCoupons },
        });

        dispatch({
          type: CART_CLEAR_SUCCESS,
        });
      }
    } catch (error) {
      dispatch({
        type: CART_CLEAR_FAIL,
        error,
      });
    }
  };
}

export function change(id: string, data: Product) {
  return (dispatch: Dispatch<CartActionTypes>) => {
    dispatch({ type: CART_CHANGE_REQUEST });

    return Api.put(`/sra_cart_content/${id}/`, data)
      .then((response) => {
        dispatch({
          type: CART_CHANGE_SUCCESS,
          payload: response.data,
        });
      })
      .then(() => fetch(undefined, data.coupons)(dispatch))
      .catch((error) => {
        dispatch({
          type: CART_CHANGE_FAIL,
          error,
        });
      });
  };
}

export function remove(id: string, coupons: Coupons) {
  let appliedCoupons: string[] = [];
  if (coupons) {
    const allAppliedCoupons = getAllAppliedCoupons(coupons);

    appliedCoupons = coupons.general
      ? Object.keys(coupons.general)
      : allAppliedCoupons;
  }

  return (dispatch: Dispatch<CartActionTypes>) => {
    dispatch({ type: CART_REMOVE_REQUEST });
    return Api.delete(`/sra_cart_content/${id}/`, {
      params: { coupon_codes: appliedCoupons },
    })
      .then((response) => {
        dispatch({
          type: CART_REMOVE_SUCCESS,
          payload: response.data,
        });
        // Calculate cart
        setTimeout(() => fetch(undefined, coupons)(dispatch), 50);
      })
      .catch((error) => {
        dispatch({
          type: CART_REMOVE_FAIL,
          error,
        });
      });
  };
}

export function changeAmount(cid: string, amount: number, id = '') {
  return (dispatch: Dispatch<CartActionTypes>) => {
    dispatch({ type: CART_LOADING });
    dispatch({
      type: CHANGE_AMOUNT,
      payload: {
        cid,
        amount,
        id,
      },
    });
  };
}

export function addCoupon(
  coupon: string,
  cartId: string = '',
  shippingId: string,
  oldAppliedCoupons: Coupons,
) {
  if (oldAppliedCoupons.general) {
    oldAppliedCoupons.general[coupon] = true;
  } else {
    oldAppliedCoupons[cartId][coupon] = true;
  }
  return async (dispatch: Dispatch<CartActionTypes>) => {
    const response = await recalculateTotal(
      shippingId,
      oldAppliedCoupons,
      cartId,
    )(dispatch);

    if (Object.keys(response.coupons).includes(coupon.toLowerCase())) {
      dispatch({
        type: CART_ADD_COUPON_CODE,
      });
    } else {
      dispatch({
        type: CART_ADD_COUPON_CODE_FAILED,
      });
      dispatch({
        type: NOTIFICATION_SHOW,
        payload: {
          type: 'warning',
          title: i18n.t('Notice'),
          text: i18n.t(
            'The entered code cannot be applied, because it does not meet the requirements.',
          ),
        },
      });
    }
  };
}

export function removeCoupon(newCoupons: Coupons) {
  return (dispatch: Dispatch<CartActionTypes>) => {
    dispatch({
      type: CART_REMOVE_COUPON_CODE,
      payload: { newCoupons },
    });
  };
}
