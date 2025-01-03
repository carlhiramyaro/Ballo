import "dotenv/config";

export default {
  expo: {
    name: "Ballo",
    extra: {
      clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
    },
    web: {
      bundler: "metro",
    },
  },
};
