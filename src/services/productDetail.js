import { has, get, values } from 'lodash';
import { filterObject } from '../utils/index';
import {
  DISCUSSION_COMMUNICATION_AND_RATING,
  DISCUSSION_RATING,
  OPTION_TYPE_CHECKBOX,
  OPTION_TYPE_IMAGES,
  OPTION_IS_REQUIRED,
  OPTION_TYPE_TEXT,
  OPTION_TYPE_TEXT_AREA,
  OPTION_TYPE_FILE,
} from '../constants';
import i18n from '../utils/i18n';

export const formatOptionsToUrl = (parameterName, selectedOptions) => {
  const options = [];
  Object.keys(selectedOptions).forEach((optionId) => {
    if (typeof selectedOptions[optionId].variant_id !== 'undefined') {
      options.push(
        `${encodeURIComponent(`${parameterName}[${optionId}]`)}=${
          selectedOptions[optionId].variant_id
        }`,
      );
    } else {
      options.push(
        `${encodeURIComponent(`${parameterName}[${optionId}]`)}=${
          selectedOptions[optionId]
        }`,
      );
    }
  });

  return options.join('&');
};

const getProductImagesPaths = (data = {}, size = '1000x1000') => {
  const images = [];
  if (has(data, 'main_pair.detailed.image_path')) {
    images.push(get(data, 'main_pair.detailed.image_path'));
  } else if (has(data, `main_pair.icons.${size}.image_path`)) {
    images.push(get(data, `main_pair.icons.${size}.image_path`));
  }

  values(data.image_pairs).forEach((img) => {
    if (has(img, 'detailed.image_path')) {
      images.push(get(img, 'detailed.image_path'));
    } else if (has(img, `icons.${size}.image_path`)) {
      images.push(get(img, `icons.${size}.image_path`));
    } else if (has(img, 'icon.image_path')) {
      images.push(get(img, 'icon.image_path'));
    }
  });

  return images;
};

export const filterFeaturesAndVariations = (oldProductData) => {
  const newProductData = { ...oldProductData };

  if (!newProductData.variation_features_variants) {
    return oldProductData;
  }

  // Filters variants field of variation_features_variants elements.
  // If the variant doesn`t have product_id, we just delete this variant from the list.
  Object.keys(newProductData.variation_features_variants).forEach(
    (featureVariant) => {
      newProductData.variation_features_variants[featureVariant].variants =
        filterObject(
          newProductData.variation_features_variants[featureVariant].variants,
          (variant) => {
            return variant.product_id;
          },
        );
    },
  );

  // Checking if the variation has options. If not, we make it a feature.
  newProductData.variation_features_variants = filterObject(
    newProductData.variation_features_variants,
    (featuresVariant) => {
      return Object.keys(featuresVariant.variants).length > 1;
    },
  );

  // We remove features, if they are in variations.
  newProductData.product_features = filterObject(
    newProductData.product_features,
    (feature) => {
      return !Object.keys(newProductData.variation_features_variants).includes(
        feature.feature_id,
      );
    },
  );

  return newProductData;
};

const convertProductOptions = (oldProductOptions) => {
  const newProductOptions = Object.keys(oldProductOptions).map((option) => {
    const newProductOption = { ...oldProductOptions[option] };

    // If option has images, we change option type to 'P'
    if (
      typeof newProductOption.variants !== 'undefined' &&
      newProductOption.variants.length &&
      Object.keys(
        newProductOption?.variants[Object.keys(newProductOption.variants)[0]]
          .image_pair,
      ).length
    ) {
      newProductOption.option_type = OPTION_TYPE_IMAGES;
    }

    newProductOption.selectTitle = oldProductOptions[option].option_name;
    newProductOption.selectDefaultId = oldProductOptions[option].option_id;

    if (typeof oldProductOptions[option].variants !== 'undefined') {
      newProductOption.selectVariants = Object.keys(
        oldProductOptions[option].variants,
      ).map((variantId) => {
        const selectVariant = {
          ...oldProductOptions[option].variants[variantId],
        };
        selectVariant.selectVariantName = selectVariant.variant_name;
        if (Object.keys(selectVariant.image_pair).length) {
          selectVariant.selectImgPath =
            selectVariant.image_pair.icon.image_path;
        }
        selectVariant.selectValue = selectVariant.variant_name;
        selectVariant.selectId = selectVariant.option_id;

        return selectVariant;
      });
    }

    if (newProductOption.option_type === OPTION_TYPE_CHECKBOX) {
      newProductOption.selectVariants.sort((a, b) =>
        a.position < b.position ? 1 : -1,
      );
    }

    if (
      (!newProductOption.value &&
        newProductOption.option_type !== OPTION_TYPE_TEXT &&
        newProductOption.option_type !== OPTION_TYPE_TEXT_AREA) ||
      newProductOption.value === OPTION_IS_REQUIRED
    ) {
      newProductOption.selectVariants.push({
        selectValue: i18n.t('Please, select one'),
        selectVariantName: OPTION_IS_REQUIRED,
        variant_id: OPTION_IS_REQUIRED,
        variant_name: i18n.t('Please, select one'),
      });
    }

    return newProductOption;
  });

  return newProductOptions;
};

const convertProductVariants = (oldProductVariants) => {
  const featureStyleValues = {
    dropdown_images: 'P',
    dropdown_labels: 'S',
    dropdown: 'S',
  };

  if (oldProductVariants) {
    const newProductVariants = Object.keys(oldProductVariants).map(
      (variant) => {
        const newProductVariant = { ...oldProductVariants[variant] };
        newProductVariant.selectTitle =
          oldProductVariants[variant].internal_name;
        newProductVariant.selectDefaultId =
          oldProductVariants[variant].variant_id;
        newProductVariant.option_type =
          featureStyleValues[oldProductVariants[variant].feature_style];

        newProductVariant.selectVariants = Object.keys(
          oldProductVariants[variant].variants,
        ).map((variantId) => {
          const selectVariant = {
            ...oldProductVariants[variant].variants[variantId],
          };
          selectVariant.selectVariantName = selectVariant.variant;
          if (selectVariant.product?.main_pair?.detailed?.image_path) {
            selectVariant.selectImgPath =
              selectVariant.product.main_pair.detailed.image_path;
          }
          selectVariant.selectValue = selectVariant.variant;
          selectVariant.selectId = selectVariant.variant_id;
          return selectVariant;
        });

        return newProductVariant;
      },
    );

    return newProductVariants;
  }

  return [];
};

const setSelectedOptions = (product) => {
  const selectedOptions = { ...product.selectedOptions };

  if (!Object.keys(selectedOptions).length) {
    product.convertedOptions.forEach((option) => {
      if (option.option_type === OPTION_TYPE_CHECKBOX) {
        if (
          option.required === 'Y' &&
          (!option.value || option.value === OPTION_IS_REQUIRED)
        ) {
          selectedOptions[option.selectDefaultId] = option.selectVariants.find(
            (el) => {
              if (el.position === '0') {
                el.variant_id = OPTION_IS_REQUIRED;
                return el;
              }
            },
          );
        } else {
          selectedOptions[option.selectDefaultId] = option.selectVariants.find(
            (el) => parseInt(el.variant_id, 10) === parseInt(option.value, 10),
          );
        }
      } else if (
        option.option_type === OPTION_TYPE_TEXT ||
        option.option_type === OPTION_TYPE_TEXT_AREA ||
        option.option_type === OPTION_TYPE_FILE
      ) {
        selectedOptions[option.selectDefaultId] = option.value;
      } else {
        if (!option.value || option.value === OPTION_IS_REQUIRED) {
          selectedOptions[option.selectDefaultId] = option.selectVariants.find(
            (el) => el.variant_id === OPTION_IS_REQUIRED,
          );
        } else {
          selectedOptions[option.selectDefaultId] = option.selectVariants.find(
            (el) => parseInt(el.variant_id, 10) === parseInt(option.value, 10),
          );
        }
      }
    });
  }

  return selectedOptions;
};

const setSelectedVariants = (product) => {
  const selectedVariants = { ...product.selectedVariants };

  if (!Object.keys(selectedVariants).length) {
    product.convertedVariants.forEach((variant) => {
      selectedVariants[variant.selectDefaultId] = variant.selectVariants.find(
        (el) => el.selectId === variant.selectDefaultId,
      );
    });
  }

  return selectedVariants;
};

const setRating = (product) => {
  if (
    product.discussion_type !== DISCUSSION_RATING &&
    product.discussion_type !== DISCUSSION_COMMUNICATION_AND_RATING
  ) {
    return false;
  }

  return true;
};

const isProductOffer = (product) => {
  if (parseInt(product.master_product_offers_count, 10)) {
    return true;
  }

  return false;
};

export const convertProduct = (data) => {
  let convertedProduct = { ...data };

  convertedProduct = filterFeaturesAndVariations(convertedProduct);
  convertedProduct.convertedOptions = convertProductOptions(
    convertedProduct.product_options,
  );
  convertedProduct.convertedVariants = convertProductVariants(
    convertedProduct.variation_features_variants,
  );
  convertedProduct.images = getProductImagesPaths(convertedProduct);
  convertedProduct.selectedOptions = setSelectedOptions(convertedProduct);
  convertedProduct.selectedVariants = setSelectedVariants(convertedProduct);
  convertedProduct.rating = setRating(convertedProduct);
  convertedProduct.isProductOffer = isProductOffer(convertedProduct);

  return convertedProduct;
};
