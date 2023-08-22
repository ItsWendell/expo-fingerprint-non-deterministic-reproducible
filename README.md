# Non-deterministic `@expo/fingerprint`

The package `@expo/fingerprint` is supposed to create a deterministic fingerprint of an Expo project. I was attempting to use this to fingerprint the runtime version, but ran into two issues.

To run fingerprinting in this repository:

1. Install packages: `pnpm install`
2. Open your terminal in the `apps/expo` folder
3. Run `pnpm fingerprint`

This starts a script that runs the fingerprint package, writes the output to the fingerprint.json file, and outputs the diff between the previous version.

## Issue 1: Relative config plugin paths in app config
Having an relative plugin path results in the following diff always being non-deterministic:

```json
[
  {
    "type": "dir",
    "filePath": "",
    "reasons": [
      "expoConfigPlugins",
      "expoConfig",
      "easBuild"
    ],
    "hash": "15a1ebf6d71be03c5b682712cc5864fe8ab54a73"
  }
]
```

To reproduce this, in `apps/expo/app.config.ts` add / remove `plugins: ["expo-router", "./expo-plugins/with-modify-gradle.js"]`, and run `pnpm fingerprint`` in this folder multiple times.

## Issue 2: androidAutoLinking / expo-modules-autolinking

Now, if we remove this relative plugin path, and run `pnpm fingerprint` multiple times, it results in the following issue with `expoAutolinkingAndroid`, here's the output I get:

1. A couple (4/5) non-diff `[]` outputs
2. The following diff:
```json
[
  {
    "type": "contents",
    "id": "expoAutolinkingConfig:android",
    "contents": "{\"extraDependencies\":{\"androidMavenRepos\":[],\"iosPods\":{}},\"modules\":[{\"packageName\":\"expo\",\"packageVersion\":\"49.0.7\",\"projects\":[{\"name\":\"expo\",\"sourceDir\":\"../../node_modules/expo/android\"}],\"modules\":[]},{\"packageName\":\"expo-application\",\"packageVersion\":\"5.3.0\",\"projects\":[{\"name\":\"expo-application\",\"sourceDir\":\"../../node_modules/expo-application/android\"}],\"modules\":[]},{\"packageName\":\"expo-constants\",\"packageVersion\":\"14.4.2\",\"projects\":[{\"name\":\"expo-constants\",\"sourceDir\":\"../../node_modules/expo-constants/android\"}],\"modules\":[\"expo.modules.constants.ConstantsModule\"]},{\"packageName\":\"expo-file-system\",\"packageVersion\":\"15.4.3\",\"projects\":[{\"name\":\"expo-file-system\",\"sourceDir\":\"../../node_modules/expo-file-system/android\"}],\"modules\":[\"expo.modules.filesystem.FileSystemModule\"]},{\"packageName\":\"expo-font\",\"packageVersion\":\"11.4.0\",\"projects\":[{\"name\":\"expo-font\",\"sourceDir\":\"../../node_modules/expo-font/android\"}],\"modules\":[]},{\"packageName\":\"expo-keep-awake\",\"packageVersion\":\"12.3.0\",\"projects\":[{\"name\":\"expo-keep-awake\",\"sourceDir\":\"../../node_modules/expo-keep-awake/android\"}],\"modules\":[]},{\"packageName\":\"expo-modules-core\",\"packageVersion\":\"1.5.9\",\"projects\":[{\"name\":\"expo-modules-core\",\"sourceDir\":\"../../node_modules/expo-modules-core/android\"},{\"name\":\"expo-modules-core$android-annotation\",\"sourceDir\":\"../../node_modules/expo-modules-core/android-annotation\"},{\"name\":\"expo-modules-core$android-annotation-processor\",\"sourceDir\":\"../../node_modules/expo-modules-core/android-annotation-processor\"}],\"modules\":[]},{\"packageName\":\"expo-splash-screen\",\"packageVersion\":\"0.20.5\",\"projects\":[{\"name\":\"expo-splash-screen\",\"sourceDir\":\"../../node_modules/expo-splash-screen/android\"}],\"modules\":[\"expo.modules.splashscreen.SplashScreenModule\"]}]}",
    "reasons": [
      "expoAutolinkingAndroid"
    ],
    "hash": "1f146ce0760f451f65844001ad5ad6f8e0da847f"
  }
]
```
3. A couple of non-diff outputs (4/5) `[]`
4. Another diff output with the following
```json
[
  {
    "type": "dir",
    "filePath": "../../node_modules/expo-modules-core/android",
    "reasons": [
      "expoAutolinkingAndroid"
    ],
    "hash": "2bdad231cf587685afe1882ea2ecf965f4c2df4c"
  },
  {
    "type": "contents",
    "id": "expoAutolinkingConfig:android",
    "contents": "{\"extraDependencies\":{\"androidMavenRepos\":[],\"iosPods\":{}},\"modules\":[{\"packageName\":\"expo\",\"packageVersion\":\"49.0.7\",\"projects\":[{\"name\":\"expo\",\"sourceDir\":\"../../node_modules/expo/android\"}],\"modules\":[]},{\"packageName\":\"expo-application\",\"packageVersion\":\"5.3.0\",\"projects\":[{\"name\":\"expo-application\",\"sourceDir\":\"../../node_modules/expo-application/android\"}],\"modules\":[]},{\"packageName\":\"expo-constants\",\"packageVersion\":\"14.4.2\",\"projects\":[{\"name\":\"expo-constants\",\"sourceDir\":\"../../node_modules/expo-constants/android\"}],\"modules\":[\"expo.modules.constants.ConstantsModule\"]},{\"packageName\":\"expo-file-system\",\"packageVersion\":\"15.4.3\",\"projects\":[{\"name\":\"expo-file-system\",\"sourceDir\":\"../../node_modules/expo-file-system/android\"}],\"modules\":[\"expo.modules.filesystem.FileSystemModule\"]},{\"packageName\":\"expo-font\",\"packageVersion\":\"11.4.0\",\"projects\":[{\"name\":\"expo-font\",\"sourceDir\":\"../../node_modules/expo-font/android\"}],\"modules\":[]},{\"packageName\":\"expo-keep-awake\",\"packageVersion\":\"12.3.0\",\"projects\":[{\"name\":\"expo-keep-awake\",\"sourceDir\":\"../../node_modules/expo-keep-awake/android\"}],\"modules\":[]},{\"packageName\":\"expo-modules-core\",\"packageVersion\":\"1.5.9\",\"projects\":[{\"name\":\"expo-modules-core$android-annotation\",\"sourceDir\":\"../../node_modules/expo-modules-core/android-annotation\"},{\"name\":\"expo-modules-core\",\"sourceDir\":\"../../node_modules/expo-modules-core/android\"},{\"name\":\"expo-modules-core$android-annotation-processor\",\"sourceDir\":\"../../node_modules/expo-modules-core/android-annotation-processor\"}],\"modules\":[]},{\"packageName\":\"expo-splash-screen\",\"packageVersion\":\"0.20.5\",\"projects\":[{\"name\":\"expo-splash-screen\",\"sourceDir\":\"../../node_modules/expo-splash-screen/android\"}],\"modules\":[\"expo.modules.splashscreen.SplashScreenModule\"]}]}",
    "reasons": [
      "expoAutolinkingAndroid"
    ],
    "hash": "8cdb71db7052474a3a600a80cfdd9645536e3338"
  }
]
```
5. A couple of non-diff outputs `[]`
6. Another 'failed' run with the following diff:
```json
[
  {
    "type": "dir",
    "filePath": "../../node_modules/expo-modules-core/android-annotation",
    "reasons": [
      "expoAutolinkingAndroid"
    ],
    "hash": "26f281ea4437881518ab1765ee155868eb0fd925"
  },
  {
    "type": "contents",
    "id": "expoAutolinkingConfig:android",
    "contents": "{\"extraDependencies\":{\"androidMavenRepos\":[],\"iosPods\":{}},\"modules\":[{\"packageName\":\"expo\",\"packageVersion\":\"49.0.7\",\"projects\":[{\"name\":\"expo\",\"sourceDir\":\"../../node_modules/expo/android\"}],\"modules\":[]},{\"packageName\":\"expo-application\",\"packageVersion\":\"5.3.0\",\"projects\":[{\"name\":\"expo-application\",\"sourceDir\":\"../../node_modules/expo-application/android\"}],\"modules\":[]},{\"packageName\":\"expo-constants\",\"packageVersion\":\"14.4.2\",\"projects\":[{\"name\":\"expo-constants\",\"sourceDir\":\"../../node_modules/expo-constants/android\"}],\"modules\":[\"expo.modules.constants.ConstantsModule\"]},{\"packageName\":\"expo-file-system\",\"packageVersion\":\"15.4.3\",\"projects\":[{\"name\":\"expo-file-system\",\"sourceDir\":\"../../node_modules/expo-file-system/android\"}],\"modules\":[\"expo.modules.filesystem.FileSystemModule\"]},{\"packageName\":\"expo-font\",\"packageVersion\":\"11.4.0\",\"projects\":[{\"name\":\"expo-font\",\"sourceDir\":\"../../node_modules/expo-font/android\"}],\"modules\":[]},{\"packageName\":\"expo-keep-awake\",\"packageVersion\":\"12.3.0\",\"projects\":[{\"name\":\"expo-keep-awake\",\"sourceDir\":\"../../node_modules/expo-keep-awake/android\"}],\"modules\":[]},{\"packageName\":\"expo-modules-core\",\"packageVersion\":\"1.5.9\",\"projects\":[{\"name\":\"expo-modules-core\",\"sourceDir\":\"../../node_modules/expo-modules-core/android\"},{\"name\":\"expo-modules-core$android-annotation\",\"sourceDir\":\"../../node_modules/expo-modules-core/android-annotation\"},{\"name\":\"expo-modules-core$android-annotation-processor\",\"sourceDir\":\"../../node_modules/expo-modules-core/android-annotation-processor\"}],\"modules\":[]},{\"packageName\":\"expo-splash-screen\",\"packageVersion\":\"0.20.5\",\"projects\":[{\"name\":\"expo-splash-screen\",\"sourceDir\":\"../../node_modules/expo-splash-screen/android\"}],\"modules\":[\"expo.modules.splashscreen.SplashScreenModule\"]}]}",
    "reasons": [
      "expoAutolinkingAndroid"
    ],
    "hash": "1f146ce0760f451f65844001ad5ad6f8e0da847f"
  }
]
```

Diving deeper, it seems that the CLI tool for `expo-modules-autolinking` might be causing this, since this is where it is fetching this information.