import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  View,
  SafeAreaView,
  Image,
  BackHandler,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

// Components
import Icon from '../components/Icon';
import { Navigation } from 'react-native-navigation';
import { AppCarousel } from '../components/AppCarousel';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  img: {
    width: '94%',
    height: 400,
    resizeMode: 'contain',
  },
  slide: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnContainer: {
    position: 'absolute',
    top: 0,
    right: 14,
  },
  removeBtnContainer: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    right: 10,
    flex: 1,
    alignItems: 'center',
  },
  removeBtn: {
    padding: 10,
  },
  closeBtn: {
    color: 'black',
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

/**
 * Renders a gallery of product images.
 *
 * @reactProps {object} navigator - Navigator.
 * @reactProps {function} onRemove - Remove function.
 * @reactProps {string[]} images - Image links.
 * @reactProps {number} activeIndex - Current image index.
 */
export default class Gallery extends Component {
  /**
   * @ignore
   */
  static propTypes = {
    onRemove: PropTypes.func,
    images: PropTypes.arrayOf(PropTypes.string),
    activeIndex: PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.backHandler = null;
  }

  /**
   * Sets listener for Android back button.
   */
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.closeOverlay();
      return true;
    });
  }

  /**
   * Removes the listener.
   */
  componentWillUnmount() {
    this.backHandler.remove();
  }

  closeOverlay() {
    Navigation.dismissOverlay(this.props.componentId);
  }

  /**
   * Renders component
   *
   * @return {JSX.Element}
   */
  render() {
    const { images, onRemove } = this.props;

    if (!images.length) {
      return null;
    }

    const renderImage = (slide, index) => {
      const { item } = slide;
      return (
        <View style={styles.slide} key={index}>
          <Image style={styles.img} source={{ uri: item }} />
        </View>
      );
    };

    return (
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.container}>
          <AppCarousel
            items={images}
            renderItem={renderImage}
            carouselContainerHeight={'100%'}
          />
          <TouchableOpacity
            style={styles.closeBtnContainer}
            onPress={() => this.closeOverlay()}>
            <Icon name="close" style={styles.closeBtn} />
          </TouchableOpacity>
          {onRemove && (
            <View style={styles.removeBtnContainer}>
              <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
                <Icon name="delete" style={styles.closeBtn} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }
}
