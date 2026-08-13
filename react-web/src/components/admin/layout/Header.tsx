import { useNavigate } from 'react-router-dom';
import { LogOutIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAppDispatch, useAppSelector } from '../../../redux/admin';
import { logout } from '../../../redux/admin/authSlice';

export function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/85 backdrop-blur-md">
      <div className="flex h-14 items-center justify-end px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt=""
            className="h-8 w-8 rounded-full object-cover ring-1 ring-border"
          />
          <div className="hidden text-right sm:block">
            <span className="block text-xs font-medium leading-tight text-foreground">
              {user.name}
            </span>
            <span className="block text-[10px] leading-tight text-muted-foreground">
              {user.roleName}
            </span>
          </div>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              dispatch(logout());
              navigate('/login?role=ADMIN');
            }}
          >
            <LogOutIcon className="h-3.5 w-3.5" />
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
