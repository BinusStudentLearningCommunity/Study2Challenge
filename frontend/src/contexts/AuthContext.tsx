import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { loginUser, registerUser } from '../features/auth/authService';
import apiClient from '../services/apiClient';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegistrationData {
  name: string;
  email: string;
  password?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (userData: RegistrationData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('authToken'),
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const attemptAutoLogin = async () => {
      const storedToken = localStorage.getItem('authToken');
      const storedUserString = localStorage.getItem('authUser');

      if (storedToken && storedUserString) {
        try {
          const storedUser: User = JSON.parse(storedUserString);
          apiClient.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${storedToken}`;
          setAuthState({
            user: storedUser,
            token: storedToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Failed to parse stored user data:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
          setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    attemptAutoLogin();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      const { token, user } = await loginUser(credentials);

      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(user));
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Login failed:', error);
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw error;
    }
  };

  const register = async (userData: RegistrationData) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      await registerUser(userData);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error('Registration failed:', error);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    delete apiClient.defaults.headers.common['Authorization'];

    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};