import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, checkAdminStatus } from '../firebase/firebase';

const AdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        // Check if user is admin
        const adminStatus = await checkAdminStatus(user.uid);
        setIsAdmin(adminStatus);
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/rodella-admin-access-2024" replace />;
  }

  // Redirect to login if authenticated but not admin
  if (!isAdmin) {
    return <Navigate to="/rodella-admin-access-2024" replace />;
  }

  // Render children if admin
  return children;
};

export default AdminRoute;
