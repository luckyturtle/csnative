interface Feature {
  description: string;
  feature_id: number;
  feature_type: string;
  value: string | null;
  variant: string | null;
  variant_id: string | null;
  value_int: number | null;
}

interface ConvertedFeatures {
  [key: number]: Feature;
}

export const convertProductFeatures = (
  features: Feature[],
  featuresListWithoutValues: Feature[],
) => {
  const convertedFeatures: ConvertedFeatures = {};

  features.map((feature: Feature) => {
    convertedFeatures[feature.feature_id] = feature;
  });

  // Adds features without value to convertedFeatures
  featuresListWithoutValues.map((feature) => {
    if (!convertedFeatures[feature.feature_id]) {
      convertedFeatures[feature.feature_id] = feature;
    }
  });

  return convertedFeatures;
};
