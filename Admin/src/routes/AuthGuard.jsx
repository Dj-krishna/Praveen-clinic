import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

// ==============================|| AUTH GUARD ||============================== //

export default function AuthGuard({ children }) {
  // Check if token exists in local storage
  const isAuthenticated = localStorage.getItem('authToken');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

AuthGuard.propTypes = {
  children: PropTypes.node
};
