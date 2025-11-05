import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  preferredLanguages: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const storedUser = localStorage.getItem('user');
      try {
        const api = await import('../lib/api');
        const token = api.getToken();
        if (token && storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            // corrupted localStorage - clear
            localStorage.removeItem('user');
            api.clearToken();
          }
        }
      } catch (e) {
        // fallback: if dynamic import fails, still try to load stored user
        if (storedUser) {
          try { setUser(JSON.parse(storedUser)); } catch { localStorage.removeItem('user'); }
        }
      }
    })();
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const api = await import('../lib/api');
      const data = await api.authApi.login(email, password);
      // expected response: {_id, name, email, role, token}
      const token = data?.token;
      if (!token) {
        setIsLoading(false);
        return false;
      }
      api.setToken(token);
      const loggedUser: User = {
        id: data._id,
        username: data.name || data.username || '',
        email: data.email,
        preferredLanguages: data.preferredLanguages || [],
      };
      setUser(loggedUser);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const api = await import('../lib/api');
      const data = await api.authApi.signup(username, email, password);
      const token = data?.token;
      if (token) {
        api.setToken(token);
      }
      const newUser: User = {
        id: data._id || data.id || '0',
        username: data.name || username,
        email: data.email || email,
        preferredLanguages: data.preferredLanguages || [],
      };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // remove token key directly to avoid importing helpers at top-level
    localStorage.removeItem('token');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};