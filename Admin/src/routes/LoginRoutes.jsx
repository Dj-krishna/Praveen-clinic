import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';

// jwt auth
const LoginPage = Loadable(lazy(() => import('pages/auth/login')));
const RegisterPage = Loadable(lazy(() => import('pages/auth/register')));
const ForgotPasswordPage = Loadable(lazy(() => import('pages/auth/forgot-password')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  children: [
    {
      path: '/login',
      element: <LoginPage />
    },
    {
      path: '/register',
      element: <RegisterPage />
    },
    {
      path: '/forgot-password',
      element: <ForgotPasswordPage />
    }
  ]
};

export default LoginRoutes;
