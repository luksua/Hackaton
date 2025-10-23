import { useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import type { AuthContextType } from "../types/auth";
import type { UserRole } from "../types/users";

interface ExtendedAuthContext extends AuthContextType {
  role?: UserRole;
  isClient: boolean;
  isOwner: boolean;
}

export const useAuth = (): ExtendedAuthContext => {
  const context = useContext(AuthContext) as AuthContextType;
  const { user, ...rest } = context;

  const role = user?.role;
  const isClient = role === "tenant";
  const isOwner = role === "owner";
// admi
  return useMemo(
    () => ({
      ...rest,
      user,
      role,
      isClient,
      isOwner,
    }),
    [user, rest]
  );
};
