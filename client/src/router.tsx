import AppRootLayout from '@/layouts/app-root.layout.tsx';
import AuthDataLayout from '@/layouts/auth-data.layout.tsx';
import ErrorPage from '@/pages/error.page.tsx';
import LogoutPage from '@/pages/logout.page.tsx';
import { AppLinks } from '@/shared/defines.ts';
import { createBrowserRouter } from 'react-router';
import IndexPage from './pages/index.page.tsx';
import LoginPage from './pages/login.page.tsx';
import NotFoundPage from './pages/not-found.page.tsx';
import PostPage from './pages/post.page.tsx';
import VotingPage from './pages/voting.page.tsx';

const router = createBrowserRouter([{
  Component: AuthDataLayout,
  ErrorBoundary: ErrorPage,
  children: [{
    Component: AppRootLayout,
    children: [
      { path: AppLinks.root, Component: IndexPage },
      { path: AppLinks.login, Component: LoginPage },
      { path: AppLinks.logout, Component: LogoutPage },
      { path: AppLinks.post, Component: PostPage },
      { path: AppLinks.voting.href, Component: VotingPage },
      { path: '/*', Component: NotFoundPage },
    ],
  }],
}]);

export default router;