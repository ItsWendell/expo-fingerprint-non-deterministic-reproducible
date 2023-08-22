The package `@expo/fingerprint` is supposed to create a deterministic fingerprint of an Expo project. I was attempting to use this to fingerprint my runtime version, but ran into two issues.

## Relative plugin paths in app config
Having an relative plugin path results in the following diff being non-deterministic:

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

To reproduce this, in `apps/expo/app.config.ts` add and remove `plugins: ["expo-router", "./expo-plugins/with-modify-gradle.js"]`, and run pnpm fingerprint in this folder multiple times.

## androidAutoLinking

Now, if we remove this relative plugin path, and run `pnpm fingerprint` multiple times, it results in the following issue with `expoAutolinkingAndroid`.

 - 5 good, non-changed hashes

### Failed run 1
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

 - 5 good hashes, unchanged

### Failed run 2
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

 - 6 good hashes, unchanged

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
