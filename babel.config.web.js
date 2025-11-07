/**
 * Babel Configuration for Web Platform
 * React Native Web optimizasyonları
 */

module.exports = function(api) {
  api.cache(true);
  
  return {
    presets: [
      ['babel-preset-expo', {
        web: {
          useTransformReactJSXExperimental: true,
        },
      }],
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.web.ts',
            '.ts',
            '.ios.tsx',
            '.android.tsx',
            '.web.tsx',
            '.tsx',
            '.jsx',
            '.js',
            '.json',
          ],
          alias: {
            '@components': './src/components',
            '@screens': './src/screens',
            '@utils': './src/utils',
            '@hooks': './src/hooks',
            '@store': './src/store',
            '@theme': './src/theme',
            '@types': './src/types',
            '@assets': './src/assets',
          },
        },
      ],
      // React Native Web optimizations
      ['react-native-web', {
        commonjs: true,
      }],
      // Performance optimizations for web
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-syntax-dynamic-import',
    ],
    env: {
      production: {
        plugins: [
          'transform-remove-console',
          ['react-remove-properties', {
            properties: ['testID', 'accessibilityLabel']
          }],
        ],
      },
    },
  };
};
