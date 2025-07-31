import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Layouts
import MainLayout from '../components/layout/MainLayout';

// Pages
import HomePage from '../pages/HomePage/HomePage';
import LoginPage from '../pages/LoginPage/LoginPage';
import ParticipantDashboardPage from '../pages/ParticipantDashboardPage/ParticipantDashboardPage';
import EventRegistrationPage from '../pages/EventRegistrationPage/EventRegistrationPage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import ProtectedRoute from './protectedRoutes';
import ProfilePage from '../pages/ProfilePage/ProfilePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  // {
  //   path: '/dashboard',
  //   element: <ParticipantDashboardPage />
  // },
  // {
  //   path: '/profile',
  //   element: <ProfilePage/>
  // }
  {
    element: <ProtectedRoute />, 
    children: [
      // Semua rute di dalam children ini akan memerlukan autentikasi
      {
        path: '/dashboard',
        element: (
            <ParticipantDashboardPage />
        ),
      },
      {
        path: '/profile',
        element: (
          <ProfilePage/>
        ),
      },
      {
        path: '/event-registration',
        element: <EventRegistrationPage />,
      },
    ],
  },
]);

const AppRoutes = () => <RouterProvider router={router} />;
export default AppRoutes;