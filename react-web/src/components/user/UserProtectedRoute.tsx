import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getSessionUser } from '../../services/auth-session';

export function UserProtectedRoute() {
  const location = useLocation();
  const user = getSessionUser();
  if (!user || user.role !== 'B2C') {
    const returnTo = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?role=B2C&returnTo=${returnTo}`} replace />;
  }
  return <Outlet />;
}
