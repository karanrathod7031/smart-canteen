import { createContext, useContext, useMemo, useState } from "react";
import { loginAdmin, loginStudent, registerStudent } from "../services/authService";
import { clearAuth, getStoredToken, getStoredUser, saveAuth } from "../utils/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(getStoredToken());
  const [loading, setLoading] = useState(false);

  async function studentLogin(values) {
    setLoading(true);
    try {
      const result = await loginStudent(values);
      setUser(result.user);
      setToken(result.token);
      saveAuth(result.user, result.token);
      return { success: true };
    } catch (error) {
      return { success: false, message: error?.response?.data?.msg || "Student login failed" };
    } finally {
      setLoading(false);
    }
  }

  async function studentRegister(values) {
    setLoading(true);
    try {
      const result = await registerStudent(values);
      setUser(result.user);
      setToken(result.token);
      saveAuth(result.user, result.token);
      return { success: true };
    } catch (error) {
      return { success: false, message: error?.response?.data?.msg || "Student registration failed" };
    } finally {
      setLoading(false);
    }
  }

  async function adminLogin(values) {
    setLoading(true);
    try {
      const result = await loginAdmin(values);
      setUser(result.user);
      setToken(result.token);
      saveAuth(result.user, result.token);
      return { success: true };
    } catch (error) {
      return { success: false, message: error?.response?.data?.msg || "Admin login failed" };
    } finally {
      setLoading(false);
    }
  }

   function logout() {
    setUser(null);
    setToken(null);
    clearAuth();
  }

  const value = useMemo(
    () => ({ user, token, loading, studentLogin, studentRegister, adminLogin, logout }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}