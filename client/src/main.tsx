import './assets/css/index.css';
import AppGlobalProvider from '@/providers/app-global.provider.tsx';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import ApolloClientProvider from './providers/apollo-client.provider.tsx';
import router from './router.tsx';

createRoot(document.getElementById('root')!).render(
  <AppGlobalProvider>
    <ApolloClientProvider>
      <RouterProvider router={router} />
    </ApolloClientProvider>,
  </AppGlobalProvider>
);
