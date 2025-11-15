import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/userContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(UserContext);

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedRoute;
