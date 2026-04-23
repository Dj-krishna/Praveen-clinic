import PropTypes from 'prop-types';
import { createContext, useReducer, useEffect } from 'react';

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token || null
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null
      };
    default:
      return state;
  }
};

export const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('authUser');
    if (token) {
      dispatch({ type: 'LOGIN', payload: { user: user ? JSON.parse(user) : null, token } });
    }
  }, []);

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = { children: PropTypes.node };
