import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

export interface User {
  id: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'DEPT_HEAD' | 'FACULTY' | 'PLACEMENT_OFFICER' | 'STUDENT';
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  institution?: {
    id: string;
    name: string;
    code: string;
  };
  student?: {
    id: string;
    rollNumber: string;
    batch: string;
    currentSemester: number;
    cgpa: number;
    department?: { name: string; code: string };
    program?: { name: string; code: string };
  };
  faculty?: {
    id: string;
    employeeCode: string;
    designation: string;
    department?: { name: string; code: string };
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  quickLogin: (role: 'ADMIN' | 'DEPT_HEAD' | 'FACULTY' | 'PLACEMENT_OFFICER' | 'STUDENT') => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_ACCOUNTS = {
  STUDENT: { email: 'john.doe@campusos.edu', pass: 'Student@123' },
  FACULTY: { email: 'prof.sharma@campusos.edu', pass: 'Faculty@123' },
  DEPT_HEAD: { email: 'hod.cse@campusos.edu', pass: 'Faculty@123' },
  ADMIN: { email: 'admin@campusos.edu', pass: 'Admin@123' },
  PLACEMENT_OFFICER: { email: 'placement@campusos.edu', pass: 'Placement@123' },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('campusos_access_token');
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await api.get('/auth/me');
      setUser(res.data.data);
    } catch {
      localStorage.removeItem('campusos_access_token');
      localStorage.removeItem('campusos_refresh_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await api.post('/auth/login', { email, password: pass });
    const { user: userData, tokens } = res.data.data;
    localStorage.setItem('campusos_access_token', tokens.accessToken);
    localStorage.setItem('campusos_refresh_token', tokens.refreshToken);
    setUser(userData);
  };

  const quickLogin = async (role: keyof typeof DEMO_ACCOUNTS) => {
    const creds = DEMO_ACCOUNTS[role];
    await login(creds.email, creds.pass);
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('campusos_refresh_token');
      await api.post('/auth/logout', { refreshToken });
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('campusos_access_token');
      localStorage.removeItem('campusos_refresh_token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        quickLogin,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
