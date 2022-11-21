const fs = require('fs');

const bundleId = process.argv[2];
const appVersion = process.argv[3];
const filesWithBundleId = [
  './android/app/build.gradle',
  './android/app/BUCK',
  './android/app/google-services.json',
  './android/app/src/main/AndroidManifest.xml',
  './android/app/src/main/java/com/simtech/multivendor/MainApplication.java',
  './android/app/src/main/java/com/simtech/multivendor/MainActivity.java',
];

for (let i = 0; i < filesWithBundleId.length; i++) {
  const data = fs.readFileSync(filesWithBundleId[i], { encoding: 'utf8' });
  const result = data.replace(/com.simtech.multivendor/g, bundleId);
  fs.writeFileSync(filesWithBundleId[i], result);
}

const data = fs.readFileSync('./android/app/build.gradle', {
  encoding: 'utf8',
});

const result1 = data.replace('versionCode 1', `versionCode ${appVersion}`);
const result2 = result1.replace(
  'versionName "1.0"',
  `versionName "${appVersion}.0"`,
);

fs.writeFileSync('./android/app/build.gradle', result2);
