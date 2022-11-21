import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  CATEGORY_VIEW_WITHOUT_BACKGROUND,
  CATEGORY_VIEW_WITH_BACKGROUND,
} from '../constants/index';

import { getImagePath } from '../utils';

const styles = EStyleSheet.create({
  solidImageContainer: {
    width: '32%',
    marginVertical: 5,
  },
  solidImage: {
    height: 100,
    borderRadius: '$borderRadius',
    resizeMode: 'cover',
  },
  pngImageContainer: {
    width: '32%',
    padding: 5,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: '$borderRadius',
    resizeMode: 'contain',
  },
  pngImage: {
    height: 100,
    width: '100%',
    resizeMode: 'contain',
  },
  categoryTitleWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 4,
    paddingRight: 4,
  },
  categoryTitle: {
    textAlign: 'center',
    fontSize: '0.8rem',
    paddingLeft: 4,
    paddingRight: 4,
    backgroundColor: '$categoryBlockBackgroundColor',
    color: '$categoryBlockTextColor',
  },
});

/**
 * Renders a category.
 *
 * @param {string} category - Category description.
 * @param {string} onPress - Push function.
 *
 * @return {JSX.Element}
 */
const CategoryListView = ({ category, onPress, appearance }) => {
  const imageUri = getImagePath(category);

  const renderSolidImage = () => {
    return (
      <TouchableOpacity
        onPress={() => onPress(category)}
        style={styles.solidImageContainer}>
        {imageUri ? (
          <Image
            source={{
              uri: imageUri,
            }}
            style={styles.solidImage}
          />
        ) : null}
        <View style={styles.categoryTitleWrapper}>
          <Text numberOfLines={3} style={styles.categoryTitle}>
            {category.category}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderPngImage = () => {
    return (
      <TouchableOpacity
        style={styles.pngImageContainer}
        onPress={() => onPress(category)}>
        <Image source={{ uri: imageUri }} style={styles.pngImage} />
        <View style={styles.categoryTitleWrapper}>
          <Text numberOfLines={3} style={styles.categoryTitle}>
            {category.category}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderWithoutImage = () => {
    return (
      <TouchableOpacity
        style={styles.pngImageContainer}
        onPress={() => onPress(category)}>
        <View style={styles.categoryTitleWrapper}>
          <Text numberOfLines={3} style={styles.categoryTitle}>
            {category.category}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  switch (appearance) {
    case CATEGORY_VIEW_WITHOUT_BACKGROUND:
      return renderPngImage();
    case CATEGORY_VIEW_WITH_BACKGROUND:
      return renderSolidImage();
    default:
      return renderWithoutImage();
  }
};

/**
 * @ignore
 */
CategoryListView.propTypes = {
  category: PropTypes.shape({}),
  onPress: PropTypes.func,
};

export default CategoryListView;
