import { createContext, useContext, useState, useCallback } from "react";
import { api } from "../lib/api";

const AuthContext = createContext();

const TOKEN_KEY = "garagego_token";
const USER_KEY = "garagego_user";

function loadUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  const setAuth = useCallback((data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const data = await api.post("/auth/login", { email, password });
      setAuth(data);
      return data.user;
    },
    [setAuth]
  );

  const adminLogin = useCallback(
    async (email, password) => {
      const data = await api.post("/auth/admin/login", { email, password });
      setAuth({ token: data.token, user: data.admin });
      return data.admin;
    },
    [setAuth]
  );

  const register = useCallback(
    async (payload) => {
      const data = await api.post("/auth/register", payload);
      setAuth(data);
      return data.user;
    },
    [setAuth]
  );

  const logout = useCallback(() => clearAuth(), [clearAuth]);

  const updateUser = useCallback(
    (updated) => {
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      setUser(updated);
    },
    []
  );

  const isAdmin = user?.role === "admin";
  const isAuthenticated = Boolean(user && token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading: false,
        isAdmin,
        isAuthenticated,
        login,
        adminLogin,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
