import LocalStorage from '@/shared/class/LocalStorage.ts';
import { LS_JWT_KEY } from '@/shared/defines.ts';
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';
import { FC, PropsWithChildren } from 'react';

const IS_DEV = process.env.NODE_ENV === 'development';

const httpLink = new HttpLink({
  // credentials: 'include',
  uri: `${import.meta.env.VITE_SERVER_HOST}/api/graphql`,
  headers: {
    'Authorization': 'Bearer ' + LocalStorage.get(LS_JWT_KEY),
  },
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  devtools: { enabled: IS_DEV },
  ssrMode: false,
});

const ApolloClientProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  );
};

export default ApolloClientProvider;