import { createContext, useContext, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

const clearStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Rebuilds the session from localStorage and checks the token has not expired.
// The ROLE comes from the signed token, not from the editable "user" entry.
function readSession() {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (!token || !user) return null;
    const { exp, userType } = jwtDecode(token);
    if (exp * 1000 < Date.now()) {
      clearStorage();
      return null;
    }
    return { token, user, role: userType };
  } catch {
    clearStorage();
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const login = useCallback((token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setSession(readSession());
  }, []);

  const logout = useCallback(() => {
    clearStorage();
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider value={{ session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
