import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import type {
  AuthContextType,
  AuthUser,
  LoginCredentials,
  AuthResponse,
} from "../types/auth";

axios.defaults.baseURL = "http://127.0.0.1:8000/api"; // 👈 apunta al prefijo /api
axios.defaults.withCredentials = false; // 🚫 no usamos cookies

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => { },
  logout: () => { },
  isLoading: true,
  isAuthenticated: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔄 Recuperar sesión guardada
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        const parsedUser: AuthUser = JSON.parse(storedUser);
        setUser(parsedUser);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }

    setIsLoading(false);
  }, []);

  // 🔐 Login usando token Bearer
  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);

      const response = await axios.post<AuthResponse>("/login", credentials);

      // 👇 aquí está el cambio importante
      const { user, access_token } = response.data;

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", access_token);

      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error en login:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Error de autenticación");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🚪 Logout
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  }, []);

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
