import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth.jsx";

// <ProtectedRoute role="admin"> allows only that role.
// Not logged in -> /login. Wrong role -> back to that user's own home.
// This protects the screens only. The API checks the token and role again.
export default function ProtectedRoute({ children, role }) {
  const { session } = useAuth();
  const location = useLocation();

  if (!session) return <Navigate to="/login" replace state={{ from: location }} />;
  if (role && session.role !== role)
    return <Navigate to={session.role === "admin" ? "/admin" : "/rooms"} replace />;
  return children;
}
