import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import get from 'lodash/get';
import uniqueId from 'lodash/uniqueId';

// Components
import StarsRating from './StarsRating';

const RATING_STAR_SIZE = 14;

const styles = EStyleSheet.create({
  container: {
    marginTop: 5,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: '$borderRadius',
    paddingTop: 5,
  },
  img: {
    width: 140,
    height: 60,
    marginLeft: 14,
    marginRight: 14,
    resizeMode: 'contain',
  },
  content: {
    borderColor: '#F1F1F1',
    paddingVertical: 20,
  },
  item: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    marginHorizontal: 5,
    borderRadius: '$borderRadius',
    padding: 10,
  },
  headerWrapper: {
    flexDirection: 'row',
  },
  header: {
    fontWeight: 'bold',
    fontSize: '1.3rem',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    color: '$categoriesHeaderColor',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
});

/**
 * Renders vendor block.
 *
 * @reactProps {string} name - Block name.
 * @reactProps {string} wrapper - Renders name if exists.
 * @reactProps {object[]} items - Information about vendors.
 * @reactProps {function} onPress - Opens a block.
 */
export default class VendorBlock extends Component {
  /**
   * @ignore
   */
  static propTypes = {
    name: PropTypes.string,
    wrapper: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({})),
    onPress: PropTypes.func,
  };

  static defaultProps = {
    items: [],
  };

  /**
   * Renders image.
   *
   * @param {*} item - Vendor information.
   * @param {*} index - Vendor index.
   *
   * @return {JSX.Element}
   */
  renderImage = (item, index) => {
    const imageUri = get(item, 'logos.theme.image.image_path');
    return (
      <TouchableOpacity
        key={index}
        onPress={() => this.props.onPress(item)}
        style={styles.item}>
        <Image source={{ uri: imageUri }} style={styles.img} />
        {item.average_rating > 0 && (
            <StarsRating
            value={item.average_rating}
            size={RATING_STAR_SIZE}
            isRatingSelectionDisabled
          />
        )}
      </TouchableOpacity>
    );
  };

  /**
   * Renders component
   *
   * @return {JSX.Element}
   */
  render() {
    const { items, name, wrapper } = this.props;
    return (
      <View style={styles.container}>
        {wrapper !== '' && (
          <View style={styles.headerWrapper}>
            <Text style={styles.header}>{name}</Text>
          </View>
        )}
        <FlatList
          style={styles.content}
          horizontal
          data={items}
          keyExtractor={(item, index) => uniqueId(`company_${index}`)}
          renderItem={({ item, index }) => this.renderImage(item, index)}
        />
      </View>
    );
  }
}
