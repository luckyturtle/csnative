DEFAULT_BUNDLE_ID=com.simtech.multivendor

# .SILENT:build
.PHONY: change ios android
change:
	@rm -rf android/app/src/main/res
	@find ./ios/csnative/Images.xcassets/AppIcon.appiconset -maxdepth 1 -type f -not -name "Contents.json" -delete
	@find ./ios/csnative/Images.xcassets/LaunchScreen.imageset -maxdepth 1 -type f -not -name "Contents.json" -delete
	@cp -R ./users/${USER}/src ./
	@cp -R ./users/${USER}/ios ./
	@cp -R ./users/${USER}/android ./

build_release_aab:
	@node changeBundleIdAndAppVersion ${BUNDLE_ID} ${APP_VERSION}
	@rm -rf node_modules
	@npm i
	@cd android; \
		./gradlew clean
	@react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
	@rm ./android/app/src/main/res/raw/*
	@rm -rf ./android/app/src/main/res/drawable*

build_debug_apk: build_release_aab
	@cd android; \
		./gradlew assembleDebug -x bundleReleaseJsAndAssets
