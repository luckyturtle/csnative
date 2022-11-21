import React from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import { socialLoginIconPaths } from '../utils/socialLoginIcons';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import * as nav from '../services/navigation';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '../utils/i18n';
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';

// Actions
import * as authActions from '../actions/authActions';
import { Navigation } from 'react-native-navigation';

const styles = EStyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
  },
  socialLoginTitle: {
    marginBottom: 10,
  },
  socialLoginIconsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  socialLoginIconWrapper: {
    marginHorizontal: 20,
  },
  socialLoginIcon: {
    width: 30,
    height: 30,
  },
  appleButton: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderRadius: '$borderRadius',
    marginVertical: 15,
  },
});

export const SocialLoginLinksBlock = ({
  componentId,
  isRegistration,
}: {
  componentId: string;
  isRegistration: boolean;
}) => {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);

  const onAppleButtonPress = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      const { identityToken } = appleAuthRequestResponse;

      if (identityToken) {
        const result = await dispatch(authActions.appleSignUp(identityToken));
        await dispatch(authActions.getUserData(result));
        await dispatch(authActions.authLoaded());
        Navigation.popToRoot(componentId);
      }
    } catch (error) {
      console.log('Apple auth error: ', error);
    }
  };

  if (!Object.keys(settings.socialLoginLinks).length && Platform.OS === 'android') {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.socialLoginTitle}>
        {i18n.t('Or sign-in with another identity provider:')}
      </Text>
      <View style={styles.socialLoginIconsWrapper}>
        {Object.keys(settings.socialLoginLinks).map(
          (socialLoginName, index) => {
            return (
              <TouchableOpacity
                style={styles.socialLoginIconWrapper}
                key={index}
                onPress={() =>
                  nav.showSocialLogin(componentId, {
                    title: socialLoginName,
                    isRegistration,
                    uri: settings.socialLoginLinks[socialLoginName],
                  })
                }>
                <Image
                  style={styles.socialLoginIcon}
                  source={socialLoginIconPaths[socialLoginName]}
                />
              </TouchableOpacity>
            );
          },
        )}

        {Platform.OS === 'ios' &&         
        <AppleButton
          buttonStyle={AppleButton.Style.WHITE}
          buttonType={AppleButton.Type.SIGN_IN}
          style={styles.appleButton}
          onPress={() => onAppleButtonPress()}
        />}
      </View>
    </View>
  );
};
