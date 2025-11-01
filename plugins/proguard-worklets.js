const { withDangerousMod, withPlugins } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

function withProguardFile(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const proguardRules = `# Keep worklets classes but allow R8 to handle duplicates
-dontwarn com.swmansion.worklets.**
-keep class com.swmansion.worklets.** { *; }
-keepclassmembers class com.swmansion.worklets.** { *; }

# Ignore duplicate class warnings
-dontnote com.swmansion.worklets.**
`;

      const proguardPath = path.join(
        config.modRequest.platformProjectRoot,
        'app',
        'proguard-worklets.pro'
      );

      fs.writeFileSync(proguardPath, proguardRules);

      return config;
    },
  ]);
}

module.exports = withProguardFile;