import React from 'react';
import PropTypes from 'prop-types';
import RenderHtml from 'react-native-render-html';
import { MAX_WINDOW_WIDTH } from '../utils';
import * as nav from '../services/navigation';
import EStyleSheet from 'react-native-extended-stylesheet';
import { View } from 'react-native';

const styles = EStyleSheet.create({
  container: {
    textAlign: 'left',
  },
});

/**
 * Renders detail information.
 *
 * @param {string} description - Description text.
 * @param {number} id - Id for renderers props.
 * @param {string} title - Title for renderers props.
 *
 * @return {JSX.Element}
 */
const DetailDescription = ({ description, id, title }) => {
  const horizontalPadding = 40;
  const descriptionWidth = MAX_WINDOW_WIDTH - horizontalPadding;
  const fullDescription = {
    html: description,
  };
  const renderersProps = {
    a: {
      onPress: (event, href) =>
        nav.showPage(id, {
          title: title,
          uri: href,
        }),
      enableExperimentalRtl: true,
    },
    p: {
      enableExperimentalRtl: true,
    },
  };

  return (
    <View>
      <RenderHtml
        contentWidth={descriptionWidth}
        source={fullDescription}
        renderersProps={renderersProps}
        baseStyle={styles.container}
      />
    </View>
  );
};

/**
 * @ignore
 */
DetailDescription.propTypes = {
  description: PropTypes.string,
  id: PropTypes.number,
  title: PropTypes.string,
};

export default DetailDescription;
