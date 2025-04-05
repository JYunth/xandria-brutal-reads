
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isConnected, isNewUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isConnected) {
      navigate('/');
    } else if (isNewUser) {
      navigate('/onboarding');
    }
  }, [isConnected, isNewUser, navigate]);

  if (!isConnected) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
