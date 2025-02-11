import "dotenv/config";

export default ({ config }) => {
  return {
    ...config,
    expo: {
      name: "Ballo",
      slug: "ballo",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/images/icon.png",
      scheme: "myapp",
      userInterfaceStyle: "automatic",
      newArchEnabled: true,
      ios: {
        bundleIdentifier: "com.carlhiramyaro.ballo",
        supportsTablet: true,
        buildNumber: "1.0.0",
        infoPlist: {
          ITSAppUsesNonExemptEncryption: false,
        },
      },
      android: {
        package: "com.carlhiramyaro.ballo",
        adaptiveIcon: {
          foregroundImage: "./assets/images/adaptive-icon.png",
          backgroundColor: "#ffffff",
        },
      },
      extra: {
        ...config.extra,
        clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
        eas: {
          projectId: "a2b926c2-ff26-41e6-92e4-f299cc8c8a05",
        },
      },
      web: {
        bundler: "metro",
      },
    },
  };
};
