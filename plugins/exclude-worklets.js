const { withAppBuildGradle, withProjectBuildGradle, withProguardRules } = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');

module.exports = function excludeWorklets(config) {
  // Add ProGuard rules to handle duplicate classes
  config = withProguardRules(config, (config) => {
    const rules = `
# Keep worklets classes but allow R8 to remove duplicates
-dontwarn com.swmansion.worklets.**
-keep class com.swmansion.worklets.** { *; }
-keepclassmembers class com.swmansion.worklets.** { *; }

# Ignore duplicate classes during R8
-ignorewarnings
`;
    
    config.modResults = config.modResults || [];
    config.modResults.push(rules);
    return config;
  });

  // Modify app-level build.gradle
  config = withAppBuildGradle(config, (config) => {
    if (config.modResults.contents.includes('exclude-worklets-fix-applied')) {
      return config;
    }

    let modifiedContents = config.modResults.contents;

    // Enable multidex
    if (!modifiedContents.includes('multiDexEnabled true')) {
      modifiedContents = modifiedContents.replace(
        /defaultConfig\s*{/,
        `defaultConfig {
        multiDexEnabled true`
      );
    }

    // Add resolution strategy and packaging options before dependencies block
    modifiedContents = modifiedContents.replace(
      /dependencies\s*{/,
      `configurations.all {
    resolutionStrategy {
        // Exclude worklets from react-native-worklets when reanimated is present
        eachDependency { details ->
            if (details.requested.group == 'com.swmansion.worklets' && 
                details.requested.name == 'worklets') {
                details.useTarget group: 'com.swmansion.reanimated', name: 'reanimated'
            }
        }
    }
    exclude group: 'com.swmansion.worklets', module: 'worklets'
}

android {
    packagingOptions {
        pickFirst '**/libworklets.so'
        pickFirst '**/libreanimated.so'
        exclude 'META-INF/DEPENDENCIES'
        exclude 'META-INF/LICENSE'
        exclude 'META-INF/LICENSE.txt'
        exclude 'META-INF/NOTICE'
        exclude 'META-INF/NOTICE.txt'
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
    afterEvaluate { project ->
        if (project.hasProperty('android')) {
            android {
                packagingOptions {
                    pickFirst '**/libworklets.so'
                    pickFirst '**/libreanimated.so'
                }
            }
        }
    }
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
    afterEvaluate { project ->
        if (project.hasProperty('android')) {
            android {
                packagingOptions {
                    pickFirst '**/libworklets.so'
                    pickFirst '**/libreanimated.so'
                }
            }
        }
    }
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