"use client";
import { useSetState } from "@/hooks/use-set-state";
import { CONFIG } from "@/config-global";
import axios, { endpoints } from "@/utils/axios";
import React, { useCallback, useEffect, useMemo } from "react";
import { isValidToken, setSession } from "../utils";
import { AuthContext } from "./auth-context";
import { User } from "@/models/auth/user";

type AuthStateProps = {
  user: User | null;
  loading: boolean;
};

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state, setState } = useSetState<AuthStateProps>({
    user: null,
    loading: true,
  });
  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(CONFIG.STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const res = await axios.get(`${endpoints.auth.me}?fields=*,role.name`);

        const user = res.data.data as User;

        setState({
          user: {
            ...user,
            accessToken,
            full_name: `${user.first_name} ${user.last_name}`,
            avatar:`${CONFIG.serverUrl}/assets/${user.avatar}`
          },
          loading: false,
        });
      } else {
        setState({ user: null, loading: false });
      }
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuthenticated = state.user ? "authenticated" : "unauthenticated";

  const status = state.loading ? "loading" : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
            ...state.user,
            role: state.user?.role,
            avatar:
              state.user?.avatar ??
              `${CONFIG.assetsDir}/assets/images/mock/avatar/avatar-1.webp`,
          }
        : null,
      checkUserSession,
      loading: status === "loading",
      authenticated: status === "authenticated",
      unauthenticated: status === "unauthenticated",
    }),
    [checkUserSession, state.user, status]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
