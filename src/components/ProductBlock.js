import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, ScrollView, Dimensions, I18nManager } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import ProductListView from './ProductListView';
import { PRODUCT_NUM_COLUMNS } from '../utils';

const styles = EStyleSheet.create({
  container: {
    marginTop: 5,
    backgroundColor: '#fff',
    borderRadius: '$borderRadius',
    paddingTop: 5,
    marginBottom: 10,
  },
  headerWrapper: {
    flexDirection: 'row',
  },
  header: {
    fontWeight: 'bold',
    fontSize: '1.3rem',
    padding: 10,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    color: '$categoriesHeaderColor',
  },
});

/**
 * Renders product block.
 *
 * @reactProps {string} name - Block name.
 * @reactProps {string} wrapper - Renders name if exists.
 * @reactProps {object[]} items - Products information.
 * @reactProps {function} onPress - Opens a product.
 */
export default class ProductBlock extends Component {
  /**
   * @ignore
   */
  static propTypes = {
    name: PropTypes.string,
    wrapper: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.object),
    onPress: PropTypes.func,
  };

  static defaultProps = {
    items: [],
  };

  /**
   * Renders component
   *
   * @return {JSX.Element}
   */
  render() {
    const { items, name, wrapper } = this.props;
    const { width } = Dimensions.get('window');
    const fullWidth = 100;
    const widthForItems = 94;
    const itemMargin = 10;
    const itemWidth =
      (width / fullWidth) * Math.floor(widthForItems / PRODUCT_NUM_COLUMNS);

    // If ProductBlock has only one product we have to recalculate it's width.
    let contentContainerStyleWidthIndex = items.length
    if (contentContainerStyleWidthIndex === 1) {
      contentContainerStyleWidthIndex *= PRODUCT_NUM_COLUMNS
    }

    return (
      <View style={styles.container}>
        {wrapper !== '' && (
          <View style={styles.headerWrapper}>
            <Text style={styles.header}>{name}</Text>
          </View>
        )}
        <ScrollView
          contentContainerStyle={{
            width: (itemWidth + itemMargin) * contentContainerStyleWidthIndex,
          }}
          showsHorizontalScrollIndicator={false}
          horizontal>
          {items.map((item, index) => (
            <ProductListView
              key={index}
              product={{ item }}
              onPress={() => this.props.onPress(item)}
            />
          ))}
        </ScrollView>
      </View>
    );
  }
}
