import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  
  const isAuthenticated = () => {
    const authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    // Both must exist for user to be considered authenticated
    return !!(authToken && userData);
  };
  
  if (!isAuthenticated()) {
    // Clear any stale data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('rodella_cart');
    
    // Set redirect flag if trying to access cart
    if (location.pathname === '/cart') {
      localStorage.setItem('redirectToCartAfterLogin', 'true');
    }
    
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default PrivateRoute; 