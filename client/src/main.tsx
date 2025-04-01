import './assets/css/index.css';
import PreferencesProvider from '@/providers/preferences.provider.tsx';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import ApolloClientProvider from './providers/apollo-client.provider.tsx';
import router from './router.tsx';

createRoot(document.getElementById('root')!).render(
  <PreferencesProvider>
    <ApolloClientProvider>
      <RouterProvider router={router} />
    </ApolloClientProvider>,
  </PreferencesProvider>,
);
