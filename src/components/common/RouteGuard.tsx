import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

interface RouteGuardProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ['/', '/login', '/403', '/404'];

function isPublicPath(pathname: string) {
  return PUBLIC_ROUTES.includes(pathname) || pathname.startsWith('/auth');
}

export function RouteGuard({ children }: RouteGuardProps) {
  const { user } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user && !isPublicPath(location.pathname)) {
      navigate('/', { replace: true });
    }
  }, [user, location.pathname, navigate]);

  if (!user && !isPublicPath(location.pathname)) {
    return null;
  }

  return <>{children}</>;
}