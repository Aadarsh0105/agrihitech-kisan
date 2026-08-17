import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getSessionUser } from '../../services/auth-session';

export function CompanyProtectedRoute() {
  const location = useLocation();
  const user = getSessionUser();
  if (!user || user.role !== 'COMPANY') {
    const returnTo = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?role=COMPANY&returnTo=${returnTo}`} replace />;
  }
  return <Outlet />;
}
