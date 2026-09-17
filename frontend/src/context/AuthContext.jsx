import { createContext, useContext, useState } from 'react';
import { loginUser, registerUser } from '../services/api';

const AuthContext = createContext(null);
const STORAGE_KEY = 'smart_interview_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'));
  const [authLoading, setAuthLoading] = useState(false);
  const login = async (payload) => { const result = await loginUser(payload); localStorage.setItem(STORAGE_KEY, JSON.stringify(result.user)); localStorage.setItem('smart_interview_token', result.token); setUser(result.user); return result; };
  const register = async (payload) => { const result = await registerUser(payload); localStorage.setItem(STORAGE_KEY, JSON.stringify(result.user)); localStorage.setItem('smart_interview_token', result.token); setUser(result.user); return result; };
  const setAuthData = (token, userData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    localStorage.setItem('smart_interview_token', token);
    setUser(userData);
  };
  const logout = () => { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem('smart_interview_token'); setUser(null); };
  return <AuthContext.Provider value={{ user, authLoading, login, register, setAuthData, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
