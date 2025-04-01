import { AppLinks } from '@/shared/defines.ts';
import { Link } from 'react-router';

const NotFoundPage = () => {
  return (
    <div>
      <h2>Страница не найдена, на <Link to={AppLinks.root}>главную</Link></h2>
    </div>
  );
};

export default NotFoundPage;