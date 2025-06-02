// Manajemen status login & JWT
// KODE HANYA CONTOH

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Nanti diintegrasikan dengan API client 
// import apiClient from '@/services/apiClient';
// import { UserCredentialsType, UserRegistrationDataType } from '@/features/auth/authService'; // Contoh tipe dari service

// 1. Definisikan tipe untuk data pengguna (sesuaikan dengan data backend)
export interface User {
  id: string;
  name: string;
  email: string;
}

// Tipe untuk data login (contoh sederhana)
export interface LoginCredentials {
  email: string;
  password?: string; // Password mungkin tidak disimpan di state, tapi dikirim ke API
}

// Tipe untuk data registrasi (contoh sederhana)
export interface RegistrationData {
  name: string;
  email: string;
  password?: string;
}


// 2. Definisikan tipe untuk state internal AuthContext
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Untuk loading selama proses async (misal, cek token, login)
}

// 3. Definisikan tipe untuk nilai yang disediakan oleh Context
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (userData: RegistrationData) => Promise<void>;
}

// 4. Buat Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 5. Buat Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('authToken'), // Coba ambil token dari localStorage saat inisialisasi
    isAuthenticated: false, // Akan diupdate setelah token diverifikasi atau login berhasil
    isLoading: true, // Mulai dengan true untuk proses pengecekan token awal
  });

  // Efek untuk memvalidasi token atau memuat data pengguna dari token saat komponen dimuat
  useEffect(() => {
    const attemptAutoLogin = async () => {
      const storedToken = localStorage.getItem('authToken');
      const storedUserString = localStorage.getItem('authUser');

      if (storedToken && storedUserString) {
        try {
          const storedUser: User = JSON.parse(storedUserString);
          // Di aplikasi nyata, Anda akan memvalidasi token ini ke backend
          // Untuk simulasi, kita anggap token dan user valid jika ada di localStorage
          // apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          setAuthState({
            user: storedUser,
            token: storedToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error("Failed to parse stored user data:", error);
          // Jika parsing gagal, bersihkan localStorage yang mungkin korup
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
          setAuthState({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      } else {
        // Tidak ada token, proses loading selesai
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    attemptAutoLogin();
  }, []); // Hanya dijalankan sekali saat komponen mount

  const login = async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      // --- SIMULASI API CALL UNTUK LOGIN ---
      console.log('Simulating login attempt with:', credentials);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi delay jaringan

      // Ganti ini dengan response dari API Anda yang sebenarnya
      const MOCK_TOKEN = `mock-jwt-token-for-${credentials.email}`;
      const MOCK_USER: User = { id: 'user-123', name: 'Nama Pengguna Mock', email: credentials.email };
      // --- AKHIR SIMULASI API CALL ---

      localStorage.setItem('authToken', MOCK_TOKEN);
      localStorage.setItem('authUser', JSON.stringify(MOCK_USER));
      // apiClient.defaults.headers.common['Authorization'] = `Bearer ${MOCK_TOKEN}`;

      setAuthState({
        user: MOCK_USER,
        token: MOCK_TOKEN,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Login failed:', error);
      // Pastikan state direset jika login gagal
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw error; // Lempar error agar bisa ditangani oleh UI pemanggil
    }
  };

  const register = async (userData: RegistrationData) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      // --- SIMULASI API CALL UNTUK REGISTER ---
      console.log('Simulating registration attempt with:', userData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Biasanya setelah registrasi, backend akan memberikan respons.
      // Anda mungkin perlu login otomatis atau mengarahkan ke halaman login.
      // Untuk simulasi ini, kita anggap registrasi berhasil dan tidak auto-login.
      // --- AKHIR SIMULASI API CALL ---
      setAuthState(prev => ({ ...prev, isLoading: false }));
      // alert('Registrasi berhasil! Silakan login.'); // Contoh feedback
    } catch (error) {
      console.error('Registration failed:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    // Hapus data dari localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    // Hapus header Authorization dari apiClient jika sudah di-set
    // delete apiClient.defaults.headers.common['Authorization'];

    // Reset state autentikasi
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    // Pengarahan ke halaman login bisa dilakukan di sini atau di komponen yang memanggil logout
    // window.location.href = '/login'; // Cara paksa, atau gunakan navigate dari react-router-dom
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// 6. Buat Custom Hook untuk menggunakan AuthContext
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};