import LocalStorage from '@/shared/class/LocalStorage.ts';
import { AppLinks, LS_JWT_KEY } from '@/shared/defines.ts';
import { IUserDto } from '@realtime-voting/shared/src/@types';
import * as React from 'react';
import { useNavigate } from 'react-router';

interface ILoginPayload {
  user: IUserDto;
  jwt: string;
}

type AuthProviderProps = React.PropsWithChildren<{
  data: IUserDto | null;
}>

interface IAuthContext {
  user: IUserDto | null;
  login: (payload: ILoginPayload) => void;
  update: (user: IUserDto) => void;
  logout: () => void;
}

/*
 * =============================
 */

const AuthContext = React.createContext<IAuthContext>(null!);
const useAuthContext = () => React.useContext(AuthContext);

/*
 * =============================
 */

const AuthProvider: React.FC<AuthProviderProps> = ({ children, data }) => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(data);
  
  const update = React.useCallback((user: IUserDto | null) => {
    setUser(user);
  }, []);
  
  const login = React.useCallback((payload: ILoginPayload) => {
    setUser(payload.user);
    LocalStorage.set(LS_JWT_KEY, payload.jwt);
    navigate(AppLinks.root);
  }, [navigate]);
  
  const logout = React.useCallback(() => {
    LocalStorage.remove(LS_JWT_KEY);
    setUser(null);
    navigate(AppLinks.login);
  }, [navigate]);
  
  return (
    <AuthContext.Provider value={{ user, update, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuthContext };
export default AuthProvider;