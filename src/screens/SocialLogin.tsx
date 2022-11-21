import React, { useEffect } from 'react';
import { connect, RootStateOrAny } from 'react-redux';
import { View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { WebViewer } from '../components/WebViewer';
import { Navigation } from 'react-native-navigation';
import i18n from '../utils/i18n';
import { get } from 'lodash';
import { parseQueryString } from '../utils/index';
import { bindActionCreators } from 'redux';

// Actions
import * as authActions from '../actions/authActions';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$screenBackgroundColor',
  },
});

interface ISocialLogin {
  uri: string;
  componentId: string;
  title: string;
  authActions: {
    [key: string]: Function;
  };
  isRegistration: boolean;
}

const SocialLogin: React.FC<ISocialLogin> = ({
  uri,
  componentId,
  title,
  authActions,
  isRegistration,
}) => {
  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: `${i18n.t('Select')} ${title}`.toUpperCase(),
        },
      },
    });
  });

  const loginHandler = async ({ url }: { url: string }) => {
    const urlParams: { [key: string]: string } | {} = parseQueryString(url);
    const authToken: string = get(urlParams, 'auth_token', '');

    await authActions.authLoading();

    if (authToken) {
      try {
        Navigation.popToRoot(componentId);
        await authActions.getUserData({
          data: {
            token: authToken,
            ttl: null,
          },
        });
        if (isRegistration) {
          await authActions.showRegistrationNotification(true);
        }
      } catch (error) {
        if (isRegistration) {
          await authActions.showRegistrationNotification(false);
        }
      }
    }

    authActions.authLoaded();
  };

  return (
    <View style={styles.container}>
      <WebViewer
        uri={uri}
        incognito={true}
        onNavigationStateChange={(navState) => loginHandler(navState)}
      />
    </View>
  );
};

export default connect(
  (state: RootStateOrAny) => ({
    settings: state.settings,
  }),
  (dispatch) => ({
    authActions: bindActionCreators(authActions, dispatch),
  }),
)(SocialLogin);
