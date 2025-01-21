const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

// Add additional configuration
defaultConfig.resolver.sourceExts = [
  ...defaultConfig.resolver.sourceExts,
  "jsx",
  "js",
  "tsx",
  "ts",
  "json",
];

// Ensure proper asset handling
defaultConfig.resolver.assetExts = [
  ...defaultConfig.resolver.assetExts,
  "png",
  "jpg",
  "jpeg",
  "gif",
  "ico",
];

module.exports = defaultConfig;
