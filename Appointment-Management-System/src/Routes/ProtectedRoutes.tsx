// ProtectedRoutes.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

type ProtectedRoutesProps = {
  allowedRoles: string[];
  children: React.ReactNode;
};

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ allowedRoles, children }) => {
  const userRole = localStorage.getItem('userRole'); // Get role from local storage

  if (!userRole) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    const fallbackRoute = `/${userRole}`; // e.g., /admin, /doctor, /patient
    return <Navigate to={fallbackRoute} replace />;
  }

  // Render the children if authenticated and role is allowed
  return <>{children}</>;
};

export default ProtectedRoutes;