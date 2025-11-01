const { withAppBuildGradle, withProjectBuildGradle } = require('@expo/config-plugins');

module.exports = function excludeWorklets(config) {
  // Modify app-level build.gradle
  config = withAppBuildGradle(config, (config) => {
    if (config.modResults.contents.includes('exclude-worklets-fix-applied')) {
      return config;
    }

    // Add multiDexEnabled and dependency resolution strategy
    let modifiedContents = config.modResults.contents;

    // Enable multidex
    modifiedContents = modifiedContents.replace(
      /defaultConfig\s*{/,
      `defaultConfig {
        multiDexEnabled true`
    );

    // Add resolution strategy before dependencies block
    modifiedContents = modifiedContents.replace(
      /dependencies\s*{/,
      `configurations.all {
    resolutionStrategy {
        force 'com.swmansion.reanimated:reanimated:3.15.0' // Use your reanimated version
        // Exclude worklets from react-native-worklets when reanimated is present
        exclude group: 'com.swmansion.worklets', module: 'worklets'
    }
}

// exclude-worklets-fix-applied
dependencies {
    implementation 'androidx.multidex:multidex:2.0.1'
`
    );

    config.modResults.contents = modifiedContents;
    return config;
  });

  // Also modify project-level build.gradle
  config = withProjectBuildGradle(config, (config) => {
    if (config.modResults.contents.includes('project-exclude-worklets-applied')) {
      return config;
    }

    let modifiedContents = config.modResults.contents;

    // Add subprojects configuration
    if (modifiedContents.includes('subprojects {')) {
      modifiedContents = modifiedContents.replace(
        /subprojects\s*{/,
        `subprojects {
    // project-exclude-worklets-applied
    configurations.all {
        exclude group: 'com.swmansion.worklets', module: 'worklets'
    }
`
      );
    } else {
      // Add it after allprojects block
      modifiedContents = modifiedContents.replace(
        /(allprojects\s*{[\s\S]*?})/,
        `$1

subprojects {
    // project-exclude-worklets-applied
    configurations.all {
        exclude group: 'com.swmansion.worklets', module: 'worklets'
    }
}
`
      );
    }

    config.modResults.contents = modifiedContents;
    return config;
  });

  return config;
};