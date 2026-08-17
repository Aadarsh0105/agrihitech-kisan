import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getSessionUser } from '../../services/auth-session';

export function BusinessProtectedRoute() {
  const location = useLocation();
  const user = getSessionUser();
  if (!user || user.role !== 'B2B') {
    const returnTo = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?role=B2B&returnTo=${returnTo}`} replace />;
  }
  return <Outlet />;
}
