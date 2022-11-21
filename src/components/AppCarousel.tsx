import React, { useRef, useState } from 'react';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import EStyleSheet from 'react-native-extended-stylesheet';
import { WINDOW_WIDTH } from '../utils/index';
import { ListRenderItem } from 'react-native';

const styles = (carouselContainerHeight: number | null) =>
  EStyleSheet.create({
    carouselContainer: {
      height: carouselContainerHeight,
    },
    dots: {
      width: 5,
      height: 5,
      borderRadius: 5,
      marginHorizontal: 8,
      backgroundColor: '$dotsSwiperColor',
    },
    dotsContainer: {
      marginTop: -25
    }
  });

export const AppCarousel = ({
  items,
  renderItem,
  carouselContainerHeight,
}: {
  items: readonly unknown[];
  renderItem: ListRenderItem<unknown>;
  carouselContainerHeight: number | null;
}) => {
  const ref = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const pagination = () => {
    return (
      <Pagination
        dotsLength={items.length}
        activeDotIndex={activeSlide}
        dotStyle={styles(null).dots}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        containerStyle={styles(null).dotsContainer}
      />
    );
  };

  return (
    <>
      <Carousel
        ref={ref}
        data={items}
        renderItem={renderItem}
        sliderWidth={WINDOW_WIDTH}
        itemWidth={WINDOW_WIDTH}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        activeAnimationType={'spring'}
        onSnapToItem={(index) => setActiveSlide(index)}
        contentContainerCustomStyle={
          styles(carouselContainerHeight).carouselContainer
        }
      />
      {pagination()}
    </>
  );
};
