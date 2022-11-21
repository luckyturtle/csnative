import { ImageSourcePropType } from 'react-native';

export interface ISocialLoginIconPaths {
  [key: string]: ImageSourcePropType;
}

export const socialLoginIconPaths: ISocialLoginIconPaths = {
  facebook: require('../assets/facebook_icon.png'),
  google: require('../assets/google_icon.png'),
};
