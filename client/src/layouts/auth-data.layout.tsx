import { ValidateAuthDocument } from '@/graphql/generated.ts';
import { verifyJwtPayload } from '@/graphql/queries/auth.queries.ts';
import AuthProvider from '@/providers/auth-provider.tsx';
import LocalStorage from '@/shared/class/LocalStorage.ts';
import { LS_JWT_KEY } from '@/shared/defines.ts';
import { useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';
import { Outlet } from 'react-router';

const AuthDataLayout = () => {
  const [fetchData, { data, loading }] = useLazyQuery(ValidateAuthDocument);
  
  useEffect(() => {
    const jwt = LocalStorage.get(LS_JWT_KEY);
    if (!jwt) return;
    
    fetchData({ variables: { jwt } })
      // .then(({ data }) => {
      //   // if (!data?.validateAuth) {
      //   //   LocalStorage.remove(LS_JWT_KEY);
      //   // }
      // })
      .catch((err) => {
        console.error(err);
      });
  }, [fetchData]);
  
  if (loading) {
    return (
      <div className="container">
        <h1>Loading data...</h1>
      </div>
    );
  }
  
  return (
    <AuthProvider data={verifyJwtPayload(data?.validateAuth)}>
      <Outlet />
    </AuthProvider>
  );
};

export default AuthDataLayout;