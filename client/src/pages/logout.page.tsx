import { useAuthContext } from '@/providers/auth-provider.tsx';
import { useEffect } from 'react';

const LogoutPage = () => {
  const { logout } = useAuthContext();
  
  useEffect(() => {
    logout();
  }, [logout]);
  
  return null;
};

export default LogoutPage;