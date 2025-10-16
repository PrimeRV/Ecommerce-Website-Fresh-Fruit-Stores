import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const loggedInUser = localStorage.getItem('loggedInUser');
  
  console.log('ProtectedRoute - token:', token);
  console.log('ProtectedRoute - loggedInUser:', loggedInUser);
  
  if (!token || !loggedInUser) {
    console.log('No token/user, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('User authenticated, showing cart');
  return children;
};

export default ProtectedRoute;