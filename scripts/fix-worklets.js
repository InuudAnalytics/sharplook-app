const fs = require('fs');
const path = require('path');

console.log('🔧 Starting worklets fix...');

// Only fix the node_modules file - android folder fixes will happen in EAS hook
const workletsModulePath = path.join(__dirname, '..', 'node_modules', 'react-native-worklets', 'android', 'build.gradle');

// Create a stub build.gradle for react-native-worklets
if (fs.existsSync(workletsModulePath)) {
  const workletsBackupPath = workletsModulePath + '.backup';
  
  // Backup original file if not already backed up
  if (!fs.existsSync(workletsBackupPath)) {
    const originalContent = fs.readFileSync(workletsModulePath, 'utf8');
    fs.writeFileSync(workletsBackupPath, originalContent);
    console.log('✅ Backed up original react-native-worklets build.gradle');
  }
  
  // Create minimal stub build.gradle
  const stubGradle = `// STUB BUILD FILE - WORKLETS DISABLED
// Original file backed up as build.gradle.backup
// Using Reanimated's worklets implementation instead

apply plugin: 'com.android.library'

android {
    compileSdkVersion 33
    
    defaultConfig {
        minSdkVersion 21
        targetSdkVersion 33
    }
    
    packagingOptions {
        exclude '**/libworklets.so'
    }
}

dependencies {
    implementation 'com.facebook.react:react-native:+'
}
`;
  
  fs.writeFileSync(workletsModulePath, stubGradle);
  console.log('✅ Created stub build.gradle for react-native-worklets');
} else {
  console.log('⚠️  react-native-worklets build.gradle not found - skipping');
}

// Check for android folder (will exist during EAS build)
const androidFolderExists = fs.existsSync(path.join(__dirname, '..', 'android'));

if (androidFolderExists) {
  console.log('📁 Android folder detected - applying gradle fixes...');
  
  const appBuildGradlePath = path.join(__dirname, '..', 'android', 'app', 'build.gradle');
  const projectBuildGradlePath = path.join(__dirname, '..', 'android', 'build.gradle');
  const settingsGradlePath = path.join(__dirname, '..', 'android', 'settings.gradle');

  // Fix app/build.gradle
  if (fs.existsSync(appBuildGradlePath)) {
    let appBuildGradle = fs.readFileSync(appBuildGradlePath, 'utf8');
    
    // Add multidex if not present
    if (!appBuildGradle.includes('multiDexEnabled')) {
      appBuildGradle = appBuildGradle.replace(
        /defaultConfig\s*{/,
        `defaultConfig {\n        multiDexEnabled true`
      );
    }
    
    // Add packaging options
    if (!appBuildGradle.includes('pickFirst')) {
      appBuildGradle = appBuildGradle.replace(
        /android\s*{/,
        `android {\n    packagingOptions {\n        pickFirst '**/libworklets.so'\n        pickFirst '**/libreanimated.so'\n    }\n`
      );
    }
    
    // Exclude worklets dependency
    if (!appBuildGradle.includes('exclude-worklets-script-applied')) {
      const exclusionConfig = `
configurations.all {
    exclude group: 'com.swmansion.worklets', module: 'worklets'
}
// exclude-worklets-script-applied
`;
      
      appBuildGradle = appBuildGradle.replace(
        /dependencies\s*{/,
        `${exclusionConfig}\ndependencies {\n    implementation 'androidx.multidex:multidex:2.0.1'`
      );
    }
    
    fs.writeFileSync(appBuildGradlePath, appBuildGradle);
    console.log('✅ Fixed android/app/build.gradle');
  }

  // Fix project build.gradle
  if (fs.existsSync(projectBuildGradlePath)) {
    let projectBuildGradle = fs.readFileSync(projectBuildGradlePath, 'utf8');
    
    if (!projectBuildGradle.includes('project-exclude-worklets-script-applied')) {
      const subprojectsConfig = `
subprojects {
    // project-exclude-worklets-script-applied
    configurations.all {
        exclude group: 'com.swmansion.worklets', module: 'worklets'
    }
}
`;
      
      projectBuildGradle += '\n' + subprojectsConfig;
      fs.writeFileSync(projectBuildGradlePath, projectBuildGradle);
      console.log('✅ Fixed android/build.gradle');
    }
  }

  // Exclude from settings.gradle
  if (fs.existsSync(settingsGradlePath)) {
    let settingsGradle = fs.readFileSync(settingsGradlePath, 'utf8');
    
    if (!settingsGradle.includes('// EXCLUDE-WORKLETS-APPLIED')) {
      settingsGradle = settingsGradle.replace(
        /include ':react-native-worklets'/g,
        '// include \':react-native-worklets\' // EXCLUDE-WORKLETS-APPLIED'
      );
      
      settingsGradle = settingsGradle.replace(
        /project\(':react-native-worklets'\)\.projectDir[\s\S]*?react-native-worklets['"]\)/g,
        '// project(\':react-native-worklets\').projectDir excluded // EXCLUDE-WORKLETS-APPLIED'
      );
      
      fs.writeFileSync(settingsGradlePath, settingsGradle);
      console.log('✅ Excluded react-native-worklets from settings.gradle');
    }
  }
} else {
  console.log('📱 No android folder - fixes will be applied during EAS build');
}

console.log('✅ Worklets fix completed successfully!');