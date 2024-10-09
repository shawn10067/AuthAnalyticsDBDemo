import {ExpoConfig} from 'expo/config';

const config: ExpoConfig = {
  name: 'AuthAnalyticsDbDemo',
  slug: 'AuthAnalyticsDbDemo',
  scheme: 'com.AuthAnalyticsDbDemo',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: false,
    usesAppleSignIn: true,
    bundleIdentifier: 'com.shawn10067.AuthAnalyticsDbDemo',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
  },
  plugins: [
    'expo-apple-authentication',
    ['expo-router'],
    [
      'expo-media-library',
      {
        photosPermission: 'Allow AuthAnalyticsDB to access your photos.',
        savePhotosPermission: 'Allow AuthAnalyticsDB to save photos.',
        isAccessMediaLocationEnabled: true,
      },
    ],
    [
      'expo-camera',
      {
        cameraPermission: 'Allow AuthAnalyticsDB to access your camera',
        microphonePermission: 'Allow AuthAnalyticsDB to access your microphone',
        recordAudioAndroid: true,
      },
    ],
    'expo-video',
  ],
  web: {
    favicon: './assets/favicon.png',
  },
};

export default config;
