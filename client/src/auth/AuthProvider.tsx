import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getCurrentUserRequest,
  loginRequest,
  logoutRequest,
  refreshRequest,
  registerRequest,
} from "../api/auth-api";
import {
  setAccessToken,
  setAuthenticationFailureHandler,
} from "../api/api-client";
import type { LoginInput, RegisterInput, User } from "../types/auth";
import { AuthContext, type AuthContextValue } from "./auth-context";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleAuthenticationFailure = (): void => {
      setAccessToken(null);
      setUser(null);
    };

    setAuthenticationFailureHandler(handleAuthenticationFailure);

    return () => {
      setAuthenticationFailureHandler(null);
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    const restoreSession = async () => {
      try {
        const result = await refreshRequest();

        if (!isActive) {
          return;
        }

        setAccessToken(result.accessToken);

        const currentUser = await getCurrentUserRequest();

        if (isActive) {
          setUser(currentUser);
        }
      } catch {
        setAccessToken(null);

        if (isActive) {
          setUser(null);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void restoreSession();

    return () => {
      isActive = false;
    };
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const result = await loginRequest(input);

    setAccessToken(result.accessToken);
    setUser(result.user);
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    await registerRequest(input);

    const result = await loginRequest({
      email: input.email,
      password: input.password,
    });

    setAccessToken(result.accessToken);
    setUser(result.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
