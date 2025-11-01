const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function excludeWorklets(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.contents.includes('exclude-worklets-applied')) {
      return config;
    }

    // Add the exclusion rule
    config.modResults.contents = config.modResults.contents.replace(
      /dependencies\s*{/,
      `dependencies {
    configurations.all {
        exclude group: 'com.swmansion.worklets', module: 'worklets'
    }
    // exclude-worklets-applied
`
    );

    return config;
  });
};