import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "./useAuth";

interface Props {
  children: ReactNode;
}

export default function AdminRoute({ children }: Props) {
  const { isLoggedIn, role } = useAuth();

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/" replace />;

  return <>{children}</>;
}