import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// hanya contoh code struktur
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading authentication...</div>; // bisa diganti dengan komponen spinner/skeleton
  }

  if (!isAuthenticated) {
    // Jika tidak terautentikasi (dan tidak sedang loading), arahkan ke halaman login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;