import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({
  children,
  adminOnly,
}: ProtectedRouteProps) {
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );
  if (currentUser) {
    if (adminOnly && currentUser.role !== "ADMIN") {
      return <Navigate to="/profile" />;
    }
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}
