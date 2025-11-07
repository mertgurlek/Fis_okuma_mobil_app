/**
 * Metro Configuration for Web Platform
 * React Native Web bundle optimizasyonları
 */

const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Web platform için özel konfigürasyonlar
config.resolver.platforms = ['web', 'native', 'ios', 'android'];

// Web için alias'lar
config.resolver.alias = {
  '@components': path.resolve(__dirname, 'src/components'),
  '@screens': path.resolve(__dirname, 'src/screens'),
  '@utils': path.resolve(__dirname, 'src/utils'),
  '@hooks': path.resolve(__dirname, 'src/hooks'),
  '@store': path.resolve(__dirname, 'src/store'),
  '@theme': path.resolve(__dirname, 'src/theme'),
  '@types': path.resolve(__dirname, 'src/types'),
  '@assets': path.resolve(__dirname, 'src/assets'),
};

// Web için ek dosya uzantıları
config.resolver.sourceExts = [
  'web.js',
  'web.jsx',
  'web.ts',
  'web.tsx',
  ...config.resolver.sourceExts,
];

// Asset uzantıları
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'css',
  'scss',
  'sass',
  'less',
  'svg',
  'woff',
  'woff2',
  'ttf',
  'eot',
];

// Web transformer optimizasyonları
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: true,
      inlineRequires: true,
    },
  }),
};

// Web için minification
config.serializer = {
  ...config.serializer,
  createModuleIdFactory: () => (path) => {
    // Web için daha kısa module ID'ler
    const name = path.split('/').pop().replace(/\.[^.]+$/, '');
    return name;
  },
};

module.exports = config;
