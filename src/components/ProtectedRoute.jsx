import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, homeFor } from '../context/AuthContext.jsx';

/** Guests go to login (and come back afterwards); users with the wrong role go to their own dashboard. */
export default function ProtectedRoute({ roles, children }) {
  const { user, role } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname, needed: true }} />;
  if (roles && !roles.includes(role)) return <Navigate to={homeFor(role)} replace />;
  return children;
}
