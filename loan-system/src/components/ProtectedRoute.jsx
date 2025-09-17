import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const currentUser = useSelector((s) => s.auth?.currentUser);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
