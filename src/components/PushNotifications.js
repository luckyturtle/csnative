import { Platform } from 'react-native';
import { get } from 'lodash';
import messaging from '@react-native-firebase/messaging';
import { Notifications } from 'react-native-notifications';
import { registerDrawerDeepLinks } from '../utils/deepLinks';

import store from '../store';
import * as authActions from '../actions/authActions';

/**
 * Registers a notification listeners. (get, open, post)
 *
 * @param {string} componentId - Component id where notification was received.
 */
function RegisterPushListener(componentId) {
  Notifications.registerRemoteNotifications();

  Notifications.events().registerNotificationReceivedForeground(
    (notification, completion) => {
      completion({ alert: true, sound: true, badge: true });
    },
  );

  Notifications.events().registerNotificationOpened(
    (notification, completion) => {
      const targetScreen = get(
        notification,
        'payload.data.targetScreen',
        false,
      );
      if (targetScreen) {
        registerDrawerDeepLinks(
          {
            link: targetScreen,
            payload: notification.payload,
          },
          componentId,
        );
      }
      completion();
    },
  );

  const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    Notifications.postLocalNotification({
      ...remoteMessage.notification,
      data: remoteMessage.data,
    });
  });

  return unsubscribe;
}

async function requestPermissions() {
  let status = await messaging().requestPermission({
    badge: true,
    sound: true,
    alert: true,
  });

  if (
    status === messaging.AuthorizationStatus.AUTHORIZED ||
    status === messaging.AuthorizationStatus.PROVISIONAL
  ) {
    return true;
  }

  if (status === messaging.AuthorizationStatus.NOT_DETERMINED) {
    requestPermissions();
  }

  return false;
}

/**
 * Initializes notifications.
 * Requests permissions.
 * Gets token and set it to store.
 */
async function Init() {
  try {
    const result = await requestPermissions();

    if (result) {
      const { auth, settings } = store.getState();
      const token = await messaging().getToken();

      store.dispatch(
        authActions.deviceInfo({
          platform: Platform.OS,
          locale: settings.selectedLanguage.langCode,
          device_id: auth.uuid,
          token,
        }),
      );

      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}

export default {
  Init,
  RegisterPushListener,
};
