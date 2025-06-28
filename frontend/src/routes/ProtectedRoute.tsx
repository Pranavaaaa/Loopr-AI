import React from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BlurLoadingOverlay from "../components/Loading";
import { Layout } from "antd";

interface ProtectedRouteProps {
  children: ReactNode;
}

const { Content } = Layout;

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // You can show a spinner or nothing while checking auth
    return <BlurLoadingOverlay loading={loading} loadingText="Fetching transactions...">
        <Content>
        </Content>
      </BlurLoadingOverlay>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
