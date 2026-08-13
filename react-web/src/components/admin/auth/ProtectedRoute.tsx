import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/admin";
import { bootstrapAdmin } from "../../../redux/admin/authSlice";

export function ProtectedRoute() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { isAuthenticated, token, user, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      void dispatch(bootstrapAdmin());
    }
  }, [dispatch, token, user]);

  if (!token && !isAuthenticated) {
    return <Navigate to="/login?role=ADMIN" replace state={{ from: location }} />;
  }

  if (token && !user && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-sm text-muted-foreground">
        Checking session...
      </div>
    );
  }

  return <Outlet />;
}
