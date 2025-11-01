const { withAppBuildGradle, withProjectBuildGradle } = require('@expo/config-plugins');

module.exports = function excludeWorklets(config) {
  // Modify app-level build.gradle
  config = withAppBuildGradle(config, (config) => {
    if (config.modResults.contents.includes('exclude-worklets-fix-applied')) {
      return config;
    }

    let modifiedContents = config.modResults.contents;

    // Enable multidex in defaultConfig
    if (!modifiedContents.includes('multiDexEnabled true')) {
      modifiedContents = modifiedContents.replace(
        /defaultConfig\s*{/,
        `defaultConfig {
        multiDexEnabled true`
      );
    }

    // Add packaging options to android block
    const androidBlockPattern = /android\s*{/;
    if (androidBlockPattern.test(modifiedContents) && !modifiedContents.includes('pickFirst \'**/libworklets.so\'')) {
      modifiedContents = modifiedContents.replace(
        androidBlockPattern,
        `android {
    packagingOptions {
        pickFirst '**/libworklets.so'
        pickFirst '**/libreanimated.so'
    }
`
      );
    }

    // Add resolution strategy before dependencies block
    if (!modifiedContents.includes('exclude-worklets-fix-applied')) {
      modifiedContents = modifiedContents.replace(
        /dependencies\s*{/,
        `configurations.all {
    exclude group: 'com.swmansion.worklets', module: 'worklets'
}

// exclude-worklets-fix-applied
dependencies {
    implementation 'androidx.multidex:multidex:2.0.1'
`
      );
    }

    config.modResults.contents = modifiedContents;
    return config;
  });

  // Modify project-level build.gradle
  config = withProjectBuildGradle(config, (config) => {
    if (config.modResults.contents.includes('project-exclude-worklets-applied')) {
      return config;
    }

    let modifiedContents = config.modResults.contents;

    // Add subprojects configuration
    const subprojectsBlock = `
subprojects {
    // project-exclude-worklets-applied
    configurations.all {
        exclude group: 'com.swmansion.worklets', module: 'worklets'
    }
}
`;

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
      // Add it at the end
      modifiedContents += '\n' + subprojectsBlock;
    }

    config.modResults.contents = modifiedContents;
    return config;
  });

  return config;
};