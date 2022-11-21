import {
  VENDOR_FETCH_PRODUCTS_FAIL,
  VENDOR_FETCH_PRODUCTS_SUCCESS,
  VENDOR_FETCH_PRODUCT_REQUEST,
  VENDOR_FETCH_PRODUCT_FAIL,
  VENDOR_FETCH_PRODUCT_SUCCESS,
  VENDOR_DELETE_PRODUCT_SUCCESS,
  VENDOR_UPDATE_PRODUCT_REQUEST,
  VENDOR_UPDATE_PRODUCT_FAIL,
  VENDOR_UPDATE_PRODUCT_SUCCESS,
  VENDOR_PRODUCT_CHANGE_CATEGORY,
  VENDOR_FETCH_PRODUCT_FEATURES_SUCCESS,
  UPDATE_LOCAL_PRODUCT_FEATURES,
} from '../../constants';

const initialState = {
  items: [],
  loading: false,
  hasMore: true,
  page: 0,
  loadingCurrent: true,
  loadingProductFeatures: true,
  current: {},
  productFeatures: {},
};

let foundProduct;
let newItems;

export default function (state = initialState, action) {
  switch (action.type) {
    case VENDOR_FETCH_PRODUCTS_FAIL:
      return {
        ...state,
        loading: false,
        ...action.payload,
      };

    case VENDOR_FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        hasMore: action.payload.hasMore,
        page: action.payload.page,
        items:
          action.payload.page === 1
            ? action.payload.items
            : [...state.items, ...action.payload.items],
      };

    case VENDOR_DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        items: state.items.filter((item) => item.product_id !== action.payload),
      };

    case VENDOR_UPDATE_PRODUCT_FAIL:
      return {
        ...state,
        loading: false,
        loadingCurrent: false,
      };

    case VENDOR_UPDATE_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
        current: {
          ...state.current,
          ...action.payload.product,
        },
      };

    case VENDOR_UPDATE_PRODUCT_SUCCESS:
      foundProduct = state.items.findIndex(
        (item) => item.product_id === action.payload.id,
      );
      newItems = [...state.items];
      newItems[foundProduct] = {
        ...newItems[foundProduct],
        ...action.payload.product,
      };

      return {
        ...state,
        loading: false,
        current: {
          ...state.current,
          ...action.payload.product,
        },
        items: newItems,
      };

    case VENDOR_FETCH_PRODUCT_REQUEST:
      return {
        ...state,
        loadingCurrent: action.payload,
      };

    case VENDOR_FETCH_PRODUCT_SUCCESS:
      return {
        ...state,
        loadingCurrent: false,
        current: action.payload,
      };

    case VENDOR_FETCH_PRODUCT_FAIL:
      return {
        ...state,
        loadingCurrent: true,
      };

    case VENDOR_PRODUCT_CHANGE_CATEGORY:
      return {
        ...state,
        current: {
          ...state.current,
          categories: action.payload,
        },
      };

    case VENDOR_FETCH_PRODUCT_FEATURES_SUCCESS:
      return {
        ...state,
        productFeatures: action.payload,
        loadingProductFeatures: false,
      };

    case UPDATE_LOCAL_PRODUCT_FEATURES:
      return {
        ...state,
        productFeatures: { ...action.payload },
      };

    default:
      return state;
  }
}
