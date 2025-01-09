import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-expo";

type UserRole = "user" | "park_owner" | "admin";

export const useCustomAuth = () => {
  const { isLoaded, isSignedIn } = useClerkAuth();
  const { user } = useUser();

  const userRole = user?.unsafeMetadata?.role as UserRole;

  return {
    isLoaded,
    isSignedIn,
    userRole,
    isAdmin: userRole === "admin",
    isParkOwner: userRole === "park_owner",
    isUser: userRole === "user",
  };
};
