import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TextInput } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
  },
  containerWarning: {
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '$dangerColor',
    padding: 5,
    borderRadius: '$borderRadius',
  },
  optionTitleWrapper: {
    flexDirection: 'row',
  },
  title: {
    fontSize: '0.9rem',
    textAlign: 'left',
  },
  commentText: {
    color: '#9cb0c4',
    marginTop: 3,
  },
  input: {
    fontSize: '0.9rem',
    height: 60,
    borderColor: '#EEEEEE',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 8,
    padding: 8,
  },
  optionRequiredSign: {
    color: 'red',
  },
});

/**
 * Renders the option to input product properties.
 *
 * @reactProps {string} value - Initial value of the input.
 * @reactProps {object} option - Contains add information.
 * @reactProps {function} onChange - Change function.
 */
export default class extends Component {
  /**
   * @ignore
   */
  static propTypes = {
    value: PropTypes.string,
    option: PropTypes.shape({}).isRequired,
    onChange: PropTypes.func,
  };

  /**
   * @ignore
   */
  static defaultProps = {
    option: {},
    value: '',
    onChange() {},
  };

  /**
   * @ignore
   */
  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };
  }

  /**
   * Sets initial value to state.
   */
  componentDidMount() {
    const { option } = this.props;
    this.setState({ value: option.value });
  }

  /**
   * Changes input value.
   *
   * @param {string} value -  Input value.
   */
  handleChange(value) {
    this.setState({ value });
    this.props.onChange(value);
  }

  /**
   * Renders a comment about what to enter in the input.
   *
   * @param {object} option - If contains comment, renders it.
   *
   * @return {JSX.Element}
   */
  renderComment = (option) => {
    if (option.comment) {
      return <Text style={styles.commentText}>{option.comment}</Text>;
    }
    return null;
  };

  /**
   * Renders component
   *
   * @return {JSX.Element}
   */
  render() {
    const { option, style } = this.props;
    const { value } = this.state;
    const isOptionRequired = option.required === 'Y';
    const containerStyles = option.requiredOptionWarning
      ? styles.containerWarning
      : styles.container;

    return (
      <View style={{ ...containerStyles, ...style }}>
        <View style={styles.optionTitleWrapper}>
          <Text style={styles.title}>{option.option_name}:</Text>
          {isOptionRequired && (
            <Text style={styles.optionRequiredSign}> *</Text>
          )}
        </View>
        <View style={styles.optionsVariants}>
          <TextInput
            multiline
            value={value}
            style={styles.input}
            autoCapitalize="none"
            keyboardAppearance="dark"
            clearButtonMode="while-editing"
            onChangeText={(text) => this.handleChange(text)}
          />
        </View>
        {this.renderComment(option)}
      </View>
    );
  }
}
