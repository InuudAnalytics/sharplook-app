const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withIonicons(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const assetsPath = path.join(
        config.modRequest.platformProjectRoot,
        'app',
        'src',
        'main',
        'assets',
        'fonts'
      );

      // Ensure fonts directory exists
      if (!fs.existsSync(assetsPath)) {
        fs.mkdirSync(assetsPath, { recursive: true });
      }

      // Copy Ionicons font
      const ioniconsSource = path.join(
        config.modRequest.projectRoot,
        'node_modules',
        '@expo',
        'vector-icons',
        'build',
        'vendor',
        'react-native-vector-icons',
        'Fonts',
        'Ionicons.ttf'
      );

      const ioniconsTarget = path.join(assetsPath, 'Ionicons.ttf');

      if (fs.existsSync(ioniconsSource)) {
        fs.copyFileSync(ioniconsSource, ioniconsTarget);
        console.log('✅ Ionicons font copied to Android assets');
      }

      return config;
    },
  ]);
};