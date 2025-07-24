import React, { createContext, useContext, useEffect, useState } from "react";
import {
  loginApi,
  refreshTokenApi,
  decodeToken,
} from "./api";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  user: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refreshToken")
  );
  const [user, setUser] = useState<string | null>(accessToken ? "admin" : null);

  // Automatically refresh token before expiration
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (accessToken) {
      const { exp } = decodeToken(accessToken);
      const delay = exp * 1000 - Date.now() - 5000; // 5 sec before expiry

      interval = setTimeout(() => {
        if (refreshToken) {
          refreshTokenApi(refreshToken).then((res) => {
            localStorage.setItem("accessToken", res.accessToken);
            setAccessToken(res.accessToken);
          });
        }
      }, delay);
    }

    return () => clearTimeout(interval);
  }, [accessToken, refreshToken]);

  const login = async (username: string, password: string) => {
    const res = await loginApi(username, password);
    setAccessToken(res.accessToken);
    setRefreshToken(res.refreshToken);
    localStorage.setItem("accessToken", res.accessToken);
    localStorage.setItem("refreshToken", res.refreshToken);
    setUser(username);
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!accessToken, login, logout, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used in AuthProvider");
  return ctx;
};
