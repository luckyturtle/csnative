import { get } from 'lodash';
import {
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_FAIL,
  AUTH_LOGOUT,
  AUTH_REGESTRATION_SUCCESS,
  REGISTER_DEVICE_SUCCESS,
  RESTORE_STATE,
  AUTH_LOGIN_SUCCESS,
  SET_UUID,
  UNSUBSCRIBE_FROM_NOTIFICATIONS_SUCCESS,
  AUTH_LOADING,
  AUTH_LOADED,
} from '../constants';

import { AuthState, AuthActionTypes } from './authTypes';

const initialState: AuthState = {
  token: null,
  ttl: null,
  logged: false,
  uuid: null,
  fetching: false,
  error: null,
  errorStatus: null,
  deviceToken: null,
  profile_id: null,
  user_id: null,
  resetPasswordStatus: '',
  pushNotificationId: null,
};

export default function (state = initialState, action: AuthActionTypes) {
  switch (action.type) {
    case AUTH_LOGIN_REQUEST:
      return {
        ...state,
        fetching: true,
        error: null,
        errorStatus: null,
      };

    case AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        ttl: action.payload.ttl,
        logged: true,
        error: null,
        errorStatus: null,
      };

    case AUTH_REGESTRATION_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        ttl: action.payload.ttl,
        logged: true,
        fetching: false,
        error: null,
        errorStatus: null,
      };

    case AUTH_LOGIN_FAIL:
      return {
        ...state,
        fetching: false,
        error: action.payload.message,
        errorStatus: action.payload.status,
      };

    case REGISTER_DEVICE_SUCCESS:
      return {
        ...state,
        deviceToken: action.payload.token,
        pushNotificationId: action.payload.id,
      };

    case AUTH_LOGOUT:
      return { ...initialState, uuid: state.uuid };

    case SET_UUID:
      return { ...state, uuid: (+new Date()).toString(16) };

    case UNSUBSCRIBE_FROM_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        pushNotificationId: null,
      };

    case RESTORE_STATE:
      return {
        ...state,
        ...action.payload.auth,
        uuid: get(action.payload, 'auth.uuid')
          ? action.payload.auth.uuid
          : (+new Date()).toString(16),
      };

    case AUTH_LOADING:
      return {
        ...state,
        fetching: true,
      };

    case AUTH_LOADED:
      return {
        ...state,
        fetching: false,
      };

    default:
      return state;
  }
}
