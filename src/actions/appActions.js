import AsyncStorage from '@react-native-community/async-storage';
import { get } from 'lodash';
import {
  STORE_KEY,
  RESTORE_STATE,
  GET_LANGUAGES,
  GET_CURRENCIES,
  SET_CURRENCY,
  SET_LANGUAGE,
  LANGUAGE_CURRENCY_FEATURE_FLAG_OFF,
  SET_UUID,
  GET_SOCIAL_LOGIN_LINKS,
  SET_ADDONS_SETTINGS,
  SET_LAYOUT_ID,
} from '../constants';
import API from '../services/api';
import store from '../store';
import i18n from '../utils/i18n';
import { NativeModules, Platform, I18nManager } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import config from '../config';

const covertLangCodes = (translations = []) => {
  const result = {};

  translations.forEach((translation) => {
    result[`${translation.original_value}`] = translation.value;
  });

  return result;
};

const getLocalTranslations = (langCode) => {
  let translation;
  const AVAILABLE_LANGS = ['ar', 'ru', 'en', 'fr', 'it', 'es', 'pt'];

  if (AVAILABLE_LANGS.includes(langCode)) {
    switch (langCode) {
      case 'ru':
        translation = require('../config/locales/ru.json');
        break;
      case 'ar':
        translation = require('../config/locales/ar.json');
        break;
      case 'fr':
        translation = require('../config/locales/fr.json');
        break;
      case 'it':
        translation = require('../config/locales/it.json');
        break;
      case 'es':
        translation = require('../config/locales/es.json');
        break;
      case 'pt':
        translation = require('../config/locales/pt.json');
        break;
      default:
        translation = require('../config/locales/en.json');
    }
  }
  return translation;
};

// Gets languages, currencies and date format settings and sets them to the store.
export async function setStartSettings(currentLanguage, currentCurrency) {
  const platformLanguage =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0]
      : NativeModules.I18nManager.localeIdentifier;

  const deviceLanguage = platformLanguage.split('_')[0];

  try {
    const socialLogin = await API.get('sra_social_login');

    store.dispatch({
      type: GET_SOCIAL_LOGIN_LINKS,
      payload: socialLogin.data,
    });
  } catch (e) {
    console.log('Social login error: ', e);
  }

  try {
    // Gets lists of languages and currencies
    const {
      data: { currencies, languages, properties },
    } = await API.get('sra_storefront');

    store.dispatch({
      type: SET_ADDONS_SETTINGS,
      payload: properties,
    });

    store.dispatch({
      type: SET_LAYOUT_ID,
      payload: properties.layout_id,
    });

    if (!currentCurrency?.currencyCode) {
      currencies.forEach((el) => {
        if (el.is_default) {
          currentCurrency = {
            currencyCode: el.currency_code,
            symbol: el.symbol,
          };
        }
      });

      if (!currentCurrency?.currencyCode && currencies.length) {
        currentCurrency = {
          currencyCode: currencies[0].currency_code,
          symbol: currencies[0].symbol,
        };
      }
    }

    store.dispatch({
      type: SET_CURRENCY,
      payload: currentCurrency,
    });

    if (!currentLanguage?.langCode) {
      // If the device language is among the languages of the store
      // use device language.
      let isDeviceLanguage = false;
      languages.forEach((el) => {
        if (el.lang_code === deviceLanguage) {
          isDeviceLanguage = true;
        }
      });

      if (isDeviceLanguage) {
        currentLanguage = {
          langCode: deviceLanguage,
          name: deviceLanguage,
        };
      } else {
        languages.forEach((el) => {
          if (el.is_default) {
            currentLanguage = {
              langCode: el.lang_code,
              name: el.name,
            };
          }
        });
      }

      store.dispatch({
        type: SET_LANGUAGE,
        payload: currentLanguage,
      });
    }

    // Set list of languages and currencies to store
    store.dispatch({
      type: GET_CURRENCIES,
      payload: currencies,
    });

    store.dispatch({
      type: GET_LANGUAGES,
      payload: languages,
    });

    return currentLanguage;
  } catch (e) {
    currentLanguage = {
      langCode: deviceLanguage,
      name: deviceLanguage,
    };
    store.dispatch({
      type: SET_LANGUAGE,
      payload: currentLanguage,
    });
    store.dispatch({
      type: LANGUAGE_CURRENCY_FEATURE_FLAG_OFF,
    });
    console.log('Error loading languages and currencies', e);

    return currentLanguage;
  }
}

export async function initApp() {
  let currentLanguage;

  try {
    const persist = await AsyncStorage.getItem(STORE_KEY);
    if (persist) {
      store.dispatch({
        type: RESTORE_STATE,
        payload: JSON.parse(persist),
      });
    } else {
      store.dispatch({
        type: SET_UUID,
      });
    }
    const savedLanguage = get(JSON.parse(persist), 'settings.selectedLanguage');
    const savedCurrency = get(JSON.parse(persist), 'settings.selectedCurrency');
    currentLanguage = await setStartSettings(savedLanguage, savedCurrency);

    // await I18nManager.allowRTL(true);
    const isRTL = ['ar', 'he', 'fa'].includes(currentLanguage.langCode);
    await I18nManager.forceRTL(isRTL);

    // Load remote lang variables
    const transResult = await API.get(
      `/sra_translations/?name=mobile_app.mobile_&lang_code=${currentLanguage.langCode}`,
    );

    i18n.addResourceBundle(currentLanguage.langCode, 'translation', {
      ...getLocalTranslations(currentLanguage.langCode),
      ...covertLangCodes(transResult.data.langvars),
    });

    //Send data to HD
    fetch(`https://helpdesk.cs-cart.com/index.php?dispatch=mobile_app.track&platform=${Platform.OS}&bundle_id=${DeviceInfo.getBundleId()}&url=${encodeURIComponent(config.siteUrl)}`);
  } catch (error) {
    i18n.addResourceBundle(
      currentLanguage.langCode,
      'translation',
      getLocalTranslations(currentLanguage.langCode),
    );
    console.log('Error loading translations', error);
  }

  i18n.changeLanguage(currentLanguage.langCode);
}
