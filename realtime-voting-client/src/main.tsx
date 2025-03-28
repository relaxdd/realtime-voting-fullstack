import './assets/css/index.css';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import Layout from './layout.tsx';
import ApolloClientProvider from './providers/apollo-client.provider.tsx';
import router from './router.tsx';

createRoot(document.getElementById('root')!).render(
  <Layout>
    <ApolloClientProvider>
      <RouterProvider router={router} />
    </ApolloClientProvider>
  </Layout>,
);
