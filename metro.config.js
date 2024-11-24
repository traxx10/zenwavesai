// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);
  const { assetExts, sourceExts } = defaultConfig.resolver;

  // Exclude web-related files
  defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter(
    (ext) => ext !== 'html'
  );

  return {
    ...defaultConfig,
    transformer: {
      ...defaultConfig.transformer,
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      ...defaultConfig.resolver,
      assetExts: assetExts.filter((ext) => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },
  };
})();
