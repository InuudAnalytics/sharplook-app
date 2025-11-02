const fs = require('fs');
const path = require('path');

const appBuildGradlePath = path.join(__dirname, '..', 'android', 'app', 'build.gradle');
const projectBuildGradlePath = path.join(__dirname, '..', 'android', 'build.gradle');

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
  
  // Add configurations to exclude worklets
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

// Fix build.gradle
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

console.log('✅ Worklets fix applied successfully!');