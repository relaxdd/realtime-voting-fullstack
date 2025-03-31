import AppRootLayout from '@/layouts/app-root.layout.tsx';
import AuthDataLayout from '@/layouts/auth-data.layout.tsx';
import ErrorPage from '@/pages/error.page.tsx';
import { createBrowserRouter } from 'react-router';
import IndexPage from './pages/index.page.tsx';
import LoginPage from './pages/login.page.tsx';
import NotFoundPage from './pages/not-found.page.tsx';
import PostPage from './pages/post.page.tsx';
import VotingPage from './pages/voting.page.tsx';

const router = createBrowserRouter([{
  ErrorBoundary: ErrorPage,
  children: [
    {
      Component: AuthDataLayout,
      children: [{
        Component: AppRootLayout,
        children: [
          { path: '/', Component: IndexPage },
          { path: '/login', Component: LoginPage },
          { path: '/:id', Component: VotingPage },
          { path: '/post', Component: PostPage },
        ],
      }],
    },
    {
      Component: AppRootLayout,
      children: [{
        path: '*', Component: NotFoundPage,
      }],
    },
  ],
}]);

export default router;