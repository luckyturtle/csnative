import React from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import { TouchableOpacity, Image } from 'react-native';
import * as nav from '../services/navigation';
import { AppCarousel } from './AppCarousel';
import { SCREEN_WIDTH } from '../constants';
import theme from '../config/theme'

const NUMBER_HORIZONTAL_SCREEN_SIDES = 2

const styles = EStyleSheet.create({
  productImage: {
    width: SCREEN_WIDTH - theme.$containerPadding * NUMBER_HORIZONTAL_SCREEN_SIDES,
    height: 300,
    resizeMode: 'contain',
  },
});

const SwiperWrapper = ({ children }) => {
  const renderImage = (slide, index) => {
    const { item } = slide;
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          nav.showGallery({
            images: [...children],
          });
        }}>
        <Image source={{ uri: item }} style={styles.productImage} />
      </TouchableOpacity>
    );
  };
  return (
    <AppCarousel
      items={children}
      renderItem={renderImage}
      carouselContainerHeight={300}
    />
  );
};

const MemoizedSwiperWrapper = React.memo(SwiperWrapper);
export default MemoizedSwiperWrapper;
