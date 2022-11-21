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
  RESTORE_STATE,
  AUTH_LOGOUT,
} from '../constants';

interface AuthStateProducts {
  id: string;
}

interface AuthStateIds {
  id: string;
}

interface AuthStateUserData {}

interface AuthStateVendorCarts {
  id: string;
}

interface AuthStateCarts {
  [key: string]: Cart;
}

export interface AuthState {
  amount: number;
  products: AuthStateProducts[];
  ids: AuthStateIds[];
  fetching: boolean;
  user_data: AuthStateUserData;
  vendorCarts: AuthStateVendorCarts[];
  isSeparateCart: null | boolean;
  coupons: Coupons;
  carts: AuthStateCarts;
}

interface CartLoadingAction {
  type: typeof CART_LOADING;
}

interface CartClearSuccessAction {
  type: typeof CART_CLEAR_SUCCESS;
}

interface CartSuccessAction {
  type: typeof CART_SUCCESS;
  payload: {
    carts: AuthStateCarts;
    isSeparateCart: boolean;
  };
}

interface CartLoadedAction {
  type: typeof CART_LOADED;
}

interface RestoreStateAction {
  type: typeof RESTORE_STATE;
  payload: {
    cart: Cart;
  };
}

interface CartFailAction {
  type: typeof CART_FAIL;
}

interface CartRecalculateRequestAction {
  type: typeof CART_RECALCULATE_REQUEST;
}

interface CartRecalculateSuccessAction {
  type: typeof CART_RECALCULATE_SUCCESS;
  payload: {
    cart: Cart;
    cartId: string;
  };
}

interface CartRecalculateFailAction {
  type: typeof CART_RECALCULATE_FAIL;
  error: Error;
}

interface CartContentSaveRequestAction {
  type: typeof CART_CONTENT_SAVE_REQUEST;
  payload: UserData;
}

interface CartContentSaveSuccessAction {
  type: typeof CART_CONTENT_SAVE_SUCCESS;
  payload: UserData;
}

interface AuthLogoutAction {
  type: typeof AUTH_LOGOUT;
}

interface CartContentSaveFailAction {
  type: typeof CART_CONTENT_SAVE_FAIL;
  error: Error;
}

interface CartAddToCartRequestAction {
  type: typeof ADD_TO_CART_REQUEST;
}

interface CartAddToCartSuccessAction {
  type: typeof ADD_TO_CART_SUCCESS;
}

interface CartNotificationShowAction {
  type: typeof NOTIFICATION_SHOW;
  payload: {
    type: string;
    title: string;
    text: string;
  };
}

interface CartAddToCartFailAction {
  type: typeof ADD_TO_CART_FAIL;
  error: Error;
}

interface CartClearRequestAction {
  type: typeof CART_CLEAR_REQUEST;
}

interface CartClearFailAction {
  type: typeof CART_CLEAR_FAIL;
  error: Error;
}

interface CartChangeRequestAction {
  type: typeof CART_CHANGE_REQUEST;
}

interface CartChangeSuccessAction {
  type: typeof CART_CHANGE_SUCCESS;
  payload: {
    data: {};
  };
}

interface CartChangeFailAction {
  type: typeof CART_CHANGE_FAIL;
  error: Error;
}

interface CartRemoveRequestAction {
  type: typeof CART_REMOVE_REQUEST;
}

interface CartRemoveSuccessAction {
  type: typeof CART_REMOVE_SUCCESS;
  payload: {
    data: {};
  };
}

interface CartRemoveFailAction {
  type: typeof CART_REMOVE_FAIL;
  error: Error;
}

interface CartChangeAmountAction {
  type: typeof CHANGE_AMOUNT;
  payload: {
    cid: string;
    amount: number;
    id: string;
  };
}

interface CartAddCouponCodeAction {
  type: typeof CART_ADD_COUPON_CODE;
}

interface CartAddCouponCodeFailAction {
  type: typeof CART_ADD_COUPON_CODE_FAILED;
}

interface CartRemoveCouponCodeAction {
  type: typeof CART_REMOVE_COUPON_CODE;
  payload: {
    newCoupons: {};
  };
}

export type CartActionTypes =
  | CartLoadingAction
  | CartClearSuccessAction
  | CartSuccessAction
  | CartLoadedAction
  | CartFailAction
  | CartRecalculateRequestAction
  | CartRecalculateSuccessAction
  | CartRecalculateFailAction
  | CartContentSaveRequestAction
  | CartContentSaveSuccessAction
  | CartContentSaveFailAction
  | CartAddToCartRequestAction
  | CartAddToCartSuccessAction
  | CartNotificationShowAction
  | CartAddToCartFailAction
  | CartClearRequestAction
  | CartClearFailAction
  | CartChangeRequestAction
  | CartChangeSuccessAction
  | CartChangeFailAction
  | CartRemoveRequestAction
  | CartRemoveSuccessAction
  | CartRemoveFailAction
  | CartChangeAmountAction
  | CartAddCouponCodeAction
  | CartAddCouponCodeFailAction
  | CartRemoveCouponCodeAction
  | RestoreStateAction
  | AuthLogoutAction;

export interface Coupons {
  [key: string]: {
    [key: string]: number[];
  };
}

export interface Cart {
  vendor_id: string;
  amount: number;
  applied_promotions: {
    [key: number]: AppliedPromotion;
  };
  calculate_shipping: boolean;
  chosen_shipping: number[];
  chosen_shipping_disabled: boolean;
  company_shipping_failed: boolean;
  coupons: Coupons;
  default_location: {
    address: string;
    city: string;
    country: string;
    country_descr: string;
    exceptions_type: string;
    options_type: string;
    phone: string;
    state: string;
    state_descr: string;
    tracking: string;
    zipcode: string;
  };
  discount: number;
  discount_formatted: {
    price: string;
    symbol: string;
  };
  discount_subtotal: number;
  display_shipping_cost: number;
  display_shipping_cost_formatted: {
    price: string;
    symbol: string;
  };
  display_subtotal: number;
  display_subtotal_formatted: {
    price: string;
    symbol: string;
  };
  free_shipping: []; // TODO Find out what is contained in an array.
  has_coupons: boolean;
  location_hash: string;
  no_promotions: boolean;
  options_style: string;
  original_subtotal: number;
  payments: {
    [key: number]: Payment;
  };
  points_info: {
    raw_total_price: number;
    total_price: number;
  };
  product_groups: ProductGroup[];
  products: {
    [key: number]: Product;
  };
  promotions: {
    [key: number]: Promotion;
  };
  recalculate: boolean;
  shipping: {
    [key: number]: Shipping;
  };
  shipping_cost: number;
  shipping_cost_formatted: {
    price: string;
    symbol: string;
  };
  shipping_failed: boolean;
  shipping_required: boolean;
  stored_taxes: string;
  subtotal: number;
  subtotal_discount: number;
  subtotal_discount_formatted: {
    price: string;
    symbol: string;
  };
  subtotal_formatted: {
    price: string;
    symbol: string;
  };
  tax_subtotal: number;
  tax_subtotal_formatted: {
    price: string;
    symbol: string;
  };
  tax_summary: {
    added: number;
    added_formatted: {
      price: string;
      symbol: string;
    };
    included: number;
    included_formatted: {
      price: string;
      symbol: string;
    };
    total: number;
    total_formatted: {
      price: string;
      symbol: string;
    };
  };
  taxes: {
    [key: number]: {
      applies: {
        [key: number]: {
          [key: string]: number | {};
          items: {
            [key: string]: { [key: number]: boolean }[];
          };
        };
      };
      description: string;
      price_includes_tax: string;
      priority: number;
      rate_type: string;
      rate_value: string;
      regnumber: string;
      tax_subtotal: number;
    };
  };
  total: number;
  total_formatted: {
    price: string;
    symbol: string;
  };
  use_discount: boolean;
  userData: UserData;
}

interface AppliedPromotion {
  company_id: string;
  conditions: {
    set: string;
    set_value: string;
    conditions: {
      [key: number]: {
        operator: string;
        condition: string;
        value: string | number;
      };
    };
  };
  conditions_hash: string;
  detailed_description: string;
  from_date: string;
  name: string;
  number_of_usages: string;
  priority: string;
  promotion_id: string;
  short_description: string;
  status: string;
  stop: string;
  stop_other_rules: string;
  to_date: string;
  users_conditions_hash: string;
  zone: string;
}

interface Payment {
  a_surcharge: string;
  description: string;
  instructions: string;
  p_surcharge: string;
  payment: string;
  payment_id: string;
  script: null;
  surcharge_title: string;
  template: string;
}

export interface Product {
  amount: number;
  amount_total: number;
  base_price: number;
  base_price_formatted: {
    price: string;
    symbol: string;
  };
  calculation: [];
  category_ids: number[];
  chosen_shipping: null;
  company_id: string;
  company_name: string;
  company_status: string;
  discount: number;
  discount_formatted: {
    price: string;
    symbol: string;
  };
  display_price: number;
  display_price_formatted: {
    price: string;
    symbol: string;
  };
  display_subtotal: number;
  display_subtotal_formatted: {
    price: string;
    symbol: string;
  };
  edp_shipping: string;
  email: string;
  exceptions_type: string;
  exceptions_type_raw: null;
  extra: {
    product_options: {
      [key: number]: string;
    };
    unlimited_download: string;
  };
  firstname: string;
  free_shipping: string;
  group_id: number;
  in_stock: string;
  is_edp: string;
  is_op: string;
  is_oper: string;
  is_pbp: string;
  lastname: string;
  list_qty_count: string;
  list_qty_count_raw: null;
  main_category: number;
  main_pair: {
    detailed: {
      absolute_path: string;
      alt: null;
      http_image_path: string;
      https_image_path: string;
      image_path: string;
      image_x: string;
      image_y: string;
      is_high_res: boolean;
      object_id: string;
      object_type: string;
      relative_path: string;
      type: string;
    };
    detailed_id: string;
    icons: {
      [key: number]: {
        alt: null;
        detailed_image_path: string;
        height: number;
        image_path: string;
        is_thumbnail: boolean;
        width: number;
      };
      image_id: string;
      object_id: string;
      object_type: string;
      pair_id: string;
      position: string;
    };
    max_qty: string;
    max_qty_raw: null;
    min_qty: string;
    min_qty_raw: null;
    modifiers_price: number;
    options_count: string;
    options_type: string;
    options_type_raw: null;
    original_price: number;
    original_price_formatted: {
      price: string;
      symbol: string;
    };
    out_of_stock_actions: string;
    phone: string;
    price: number;
    price_formatted: {
      price: string;
      symbol: string;
    };
    product: string;
    product_code: string;
    product_id: string;
    product_options: {
      [key: number]: string;
    };
    product_options_detailed: {
      [key: number]: {
        allowed_extensions: '';
        comment: string;
        company_id: string;
        description: null;
        incorrect_message: string;
        inner_hint: string;
        max_file_size: string;
        missing_variants_handling: string;
        multiupload: string;
        option_id: string;
        option_name: string;
        option_text: string;
        option_type: string;
        position: string;
        product_id: string;
        regexp: string;
        required: string;
        status: string;
        value: string;
        variants: {
          [key: number]: {
            modifier: string;
            modifier_type: string;
            point_modifier: string;
            point_modifier_type: string;
            position: string;
            variant_id: string;
            variant_name: string;
            weight_modifier: string;
            weight_modifier_type: string;
          };
        };
      };
    };
    promotions: [];
    qty_step: string;
    qty_step_raw: null;
    shipping_freight: string;
    shipping_params: {
      box_height: number;
      box_length: number;
      box_width: number;
      max_items_in_box: number;
      min_items_in_box: number;
    };
    short_description: string;
    stored_discount: string;
    stored_price: string;
    storefront_id: string;
    subtotal: number;
    subtotal_formatted: {
      price: string;
      symbol: string;
    };
    tax_ids: string;
    tracking: string;
    tracking_raw: null;
    user_data: UserData;
    weight: number;
    zero_price_action: string;
    zero_price_action_raw: null;
  };
}

export interface ProductGroup {
  all_edp_free_shipping: boolean;
  all_free_shipping: boolean;
  company_id: number;
  free_shipping: boolean;
  name: string;
  products: {
    [key: number]: Product;
  };
  shipping_no_required: boolean;
  shipping_by_marketplace: boolean;
  shippings: {
    [key: number]: Shipping;
  };
}

interface Shipping {
  delivery_time: string;
  description: string;
  destination: string;
  free_shipping: boolean;
  group_key: number;
  image: [];
  is_address_required: string;
  max_weight: string;
  min_weight: string;
  module: null;
  rate: number;
  rate_calculation: string;
  rate_formatted: {
    price: string;
    symbol: string;
  };
  service_code: null;
  service_id: string;
  shipping: string;
  shipping_id: string;
  taxed_price: number;
  taxes: {
    [key: number]: {
      description: string;
      price_includes_tax: string;
      priority: number;
      rate_type: string;
      rate_value: string;
      regnumber: string;
      tax_subtotal: number;
    };
  };
}

interface Promotion {
  bonuses: PromotionBonus[];
}

interface PromotionBonus {
  bonus: string;
  discount_bonus: string;
  discount_value: string;
  promotion_id: string;
}

export interface UserData {
  b_address: string;
  b_address_2: string;
  b_city: string;
  b_country: string;
  b_country_descr: string;
  b_county: string;
  b_firstname: string;
  b_lastname: string;
  b_phone: string;
  b_state: string;
  b_state_descr: string;
  b_zipcode: string;
  birthday: string;
  company: string;
  company_id: string;
  email: string;
  fax: string;
  fields: [];
  firstname: string;
  is_root: string;
  lang_code: string;
  last_activity: string;
  last_login: string;
  lastname: string;
  phone: string;
  points: number;
  profile_id: string;
  profile_name: string;
  profile_type: string;
  profile_update_timestamp: string;
  purchase_timestamp_from: string;
  purchase_timestamp_to: string;
  referer: string;
  responsible_email: string;
  s_address: string;
  s_address_2: string;
  s_address_type: string;
  s_city: string;
  s_country: string;
  s_country_descr: string;
  s_county: string;
  s_firstname: string;
  s_lastname: string;
  s_phone: string;
  s_state: string;
  s_state_descr: string;
  s_zipcode: string;
  status: string;
  tax_exempt: string;
  timestamp: string;
  url: string;
  user_id: string;
  user_login: string;
  user_type: string;
  usergroups: [];
}
