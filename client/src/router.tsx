import { createBrowserRouter } from 'react-router';
import IndexPage from './pages/index.page.tsx';
import LoginPage from './pages/login.page.tsx';
import NotFoundPage from './pages/not-found.page.tsx';
import PostPage from './pages/post.page.tsx';
import VotingPage from './pages/voting.page.tsx';

const router = createBrowserRouter([
  { path: '/', Component: IndexPage },
  { path: '/:id', Component: VotingPage },
  { path: '/post', Component: PostPage },
  { path: '/login', Component: LoginPage },
  { path: '*', Component: NotFoundPage },
]);

export default router;