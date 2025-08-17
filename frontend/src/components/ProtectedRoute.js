import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Adjust path if needed

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // User not authenticated - redirect to login page
    return <Navigate to="/auth" replace />;
  }

  // Authenticated - render children (protected page)
  return children;
}
