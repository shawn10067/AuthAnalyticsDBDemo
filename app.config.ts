import {ExpoConfig} from 'expo/config';

const config: ExpoConfig = {
  name: 'moments',
  slug: 'moments',
  scheme: 'com.moments',
  version: '0.0.1',
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
    bundleIdentifier: 'com.shawn10067.moments',
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
        photosPermission: 'Allow Moments to access your photos.',
        savePhotosPermission: 'Allow Moments to save photos.',
        isAccessMediaLocationEnabled: true,
      },
    ],
    [
      'expo-camera',
      {
        cameraPermission: 'Allow Moments to access your camera',
        microphonePermission: 'Allow Moments to access your microphone',
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
