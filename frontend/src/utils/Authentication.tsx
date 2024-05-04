import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  isLoginModalOpen: boolean;
  setLoginModalOpen: (isOpen: boolean) => void;
  isRegisterModalOpen: boolean;
  setRegisterModalOpen: (isOpen: boolean) => void;
  isSettingsModalOpen: boolean;
  setSettingsModalOpen: (isOpen: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem('token');
    return storedToken && isTokenExpired(storedToken) ? null : storedToken;
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!token);
  const [isLoginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (token && isTokenExpired(token)) {
        setToken(null); // Clear token if it has expired
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, [token]);

  const value = {
    token,
    setToken,
    isLoggedIn,
    setIsLoggedIn,
    isLoginModalOpen,
    setLoginModalOpen,
    isRegisterModalOpen,
    setRegisterModalOpen,
    isSettingsModalOpen,
    setSettingsModalOpen,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Helper function to check if the token has expired
function isTokenExpired(token: string): boolean {
  try {
    const decoded: { exp: number } = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true; // Assume expired if there's an error decoding
  }
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
