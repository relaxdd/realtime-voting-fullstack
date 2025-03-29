import { Link } from 'react-router';

const NotFoundPage = () => {
  return (
    <div>
      <h2>Страница не найдена, на <Link to="/">главную</Link></h2>
    </div>
  );
};

export default NotFoundPage;