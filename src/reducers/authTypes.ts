import {
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAIL,
  AUTH_RESET_STATE,
  AUTH_REGESTRATION_REQUEST,
  AUTH_REGESTRATION_SUCCESS,
  AUTH_REGESTRATION_FAIL,
  NOTIFICATION_SHOW,
  REGISTER_DEVICE_REQUEST,
  REGISTER_DEVICE_SUCCESS,
  REGISTER_DEVICE_FAIL,
  FETCH_PROFILE_FIELDS_REQUEST,
  FETCH_PROFILE_FIELDS_SUCCESS,
  FETCH_PROFILE_FIELDS_FAIL,
  FETCH_PROFILE_REQUEST,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  AUTH_LOGOUT,
  RESTORE_STATE,
  SET_UUID,
  UNSUBSCRIBE_FROM_NOTIFICATIONS_REQUEST,
  UNSUBSCRIBE_FROM_NOTIFICATIONS_SUCCESS,
  UNSUBSCRIBE_FROM_NOTIFICATIONS_FAIL,
  DELETE_ACCOUNT_REQUEST,
  DELETE_ACCOUNT_SUCCESS,
  DELETE_ACCOUNT_FAILED,
  AUTH_LOADING,
  AUTH_LOADED,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILED,
} from '../constants';

export interface AuthState {
  token: null | string;
  ttl: null | number;
  logged: boolean;
  uuid: null | string;
  fetching: boolean;
  error: null | string;
  errorStatus: null | number;
  deviceToken: null | string;
  profile_id: null | string;
  user_id: null | number;
  resetPasswordStatus: string;
  pushNotificationId: null | number;
}

interface AuthLoginRequestAction {
  type: typeof AUTH_LOGIN_REQUEST;
}

interface AuthRegistrationSuccessAction {
  type: typeof AUTH_REGESTRATION_SUCCESS;
  payload: {
    token: string;
    ttl: number;
    profile_id: string;
    user_id: string;
  };
}

interface AuthLoginFailAction {
  type: typeof AUTH_LOGIN_FAIL;
  payload: {
    message: string;
    status: string;
  };
}

// REGISTER_DEVICE_SUCCESS
interface RegisterDeviceSuccessPayload {
  token: string;
  id: number;
  payload: {
    message: string;
    status: number;
  };
}

interface RegisterDeviceSuccessAction {
  type: typeof REGISTER_DEVICE_SUCCESS;
  payload: RegisterDeviceSuccessPayload;
}

// SET_UUID
interface SetUuidAction {
  type: typeof SET_UUID;
}

// AUTH_LOGOUT
interface AuthLogoutAction {
  type: typeof AUTH_LOGOUT;
}

interface RestoreStateAction {
  type: typeof RESTORE_STATE;
  payload: {
    auth: {
      uuid: string;
    };
  };
}

interface FetchProfileRequestAction {
  type: typeof FETCH_PROFILE_REQUEST;
}

interface FetchProfileSuccessAction {
  type: typeof FETCH_PROFILE_SUCCESS;
}

interface FetchProfileFailAction {
  type: typeof FETCH_PROFILE_FAIL;
}

interface FetchProfileFieldsRequestAction {
  type: typeof FETCH_PROFILE_FIELDS_REQUEST;
}

interface FetchProfileFieldsSuccessAction {
  type: typeof FETCH_PROFILE_FIELDS_SUCCESS;
}

interface FetchProfileFieldsFailAction {
  type: typeof FETCH_PROFILE_FIELDS_FAIL;
}

interface UpdateProfileRequestAction {
  type: typeof UPDATE_PROFILE_REQUEST;
}

interface UpdateProfileSuccessAction {
  type: typeof UPDATE_PROFILE_SUCCESS;
}

interface NotificationShowAction {
  type: typeof NOTIFICATION_SHOW;
  payload: {
    type: string;
    title: string;
    text: string;
  };
}

interface UpdateProfileFailAction {
  type: typeof UPDATE_PROFILE_FAIL;
}

interface AuthRegistrationRequestAction {
  type: typeof AUTH_REGESTRATION_REQUEST;
}

interface AuthRegistrationFailAction {
  type: typeof AUTH_REGESTRATION_FAIL;
}

interface RegisterDeviceRequestAction {
  type: typeof REGISTER_DEVICE_REQUEST;
}

interface RegisterDeviceFailAction {
  type: typeof REGISTER_DEVICE_FAIL;
}

interface AuthLoginSuccessAction {
  type: typeof AUTH_LOGIN_SUCCESS;
  payload: {
    token: string;
    ttl: number;
  };
}

interface AuthResetStateAction {
  type: typeof AUTH_RESET_STATE;
}

interface UnsubscribeNotificationsRequestAction {
  type: typeof UNSUBSCRIBE_FROM_NOTIFICATIONS_REQUEST;
}

interface UnsubscribeNotificationsSuccessAction {
  type: typeof UNSUBSCRIBE_FROM_NOTIFICATIONS_SUCCESS;
}

interface UnsubscribeNotificationsFailAction {
  type: typeof UNSUBSCRIBE_FROM_NOTIFICATIONS_FAIL;
}
interface DeleteAccountRequestAction {
  type: typeof DELETE_ACCOUNT_REQUEST;
}

interface DeleteAccountSuccessAction {
  type: typeof DELETE_ACCOUNT_SUCCESS;
}

interface DeleteAccountFailAction {
  type: typeof DELETE_ACCOUNT_FAILED;
}

interface AuthLoadingAction {
  type: typeof AUTH_LOADING;
}

interface AuthLoadedAction {
  type: typeof AUTH_LOADED;
}

interface ResetPasswordRequestAction {
  type: typeof RESET_PASSWORD_REQUEST;
}

interface ResetPasswordSuccessAction {
  type: typeof RESET_PASSWORD_SUCCESS;
}

interface ResetPasswordFailAction {
  type: typeof RESET_PASSWORD_FAILED;
}

export interface DeviceInfoData {
  device_id: string;
  locale: string;
  platform: string;
  token: string;
}

export interface UpdateProfileParams {
  email: string;
  firstname: string;
  lastname: string;
  password1: string;
  password2: string;
  phone: string;
  s_address: string;
  s_city: string;
  s_country: string;
  s_state: string;
  s_zipcode: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CreateProfileParams {
  email: string | undefined;
  firstname: string;
  lastname: string;
  password1: string;
  password2: string;
  phone: string;
}

export type AuthActionTypes =
  | AuthLoginRequestAction
  | AuthLoginFailAction
  | AuthLogoutAction
  | AuthRegistrationSuccessAction
  | RegisterDeviceSuccessAction
  | RestoreStateAction
  | FetchProfileRequestAction
  | FetchProfileSuccessAction
  | FetchProfileFailAction
  | FetchProfileFieldsSuccessAction
  | FetchProfileFieldsFailAction
  | FetchProfileFieldsRequestAction
  | UpdateProfileRequestAction
  | UpdateProfileSuccessAction
  | NotificationShowAction
  | UpdateProfileFailAction
  | AuthRegistrationRequestAction
  | AuthRegistrationFailAction
  | RegisterDeviceRequestAction
  | RegisterDeviceFailAction
  | AuthLoginSuccessAction
  | SetUuidAction
  | AuthResetStateAction
  | UnsubscribeNotificationsRequestAction
  | UnsubscribeNotificationsSuccessAction
  | UnsubscribeNotificationsFailAction
  | AuthResetStateAction
  | DeleteAccountRequestAction
  | DeleteAccountSuccessAction
  | DeleteAccountFailAction
  | AuthLoadingAction
  | AuthLoadedAction
  | ResetPasswordRequestAction
  | ResetPasswordSuccessAction
  | ResetPasswordFailAction;
