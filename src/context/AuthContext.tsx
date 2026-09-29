import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email: string, pass: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('codechef_admin_auth') === 'true';
  });
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('codechef_admin_email') || null;
  });

  const login = (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    // Default demo credentials
    if (
      (cleanEmail === 'admin@codechef.abesec' || cleanEmail === 'admin@abes.ac.in') &&
      pass === 'bawarchi2026'
    ) {
      setIsAuthenticated(true);
      setUserEmail(cleanEmail);
      localStorage.setItem('codechef_admin_auth', 'true');
      localStorage.setItem('codechef_admin_email', cleanEmail);
      return { success: true };
    }
    return { success: false, error: 'Invalid Station Master credentials. Check demo details below!' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    localStorage.removeItem('codechef_admin_auth');
    localStorage.removeItem('codechef_admin_email');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
