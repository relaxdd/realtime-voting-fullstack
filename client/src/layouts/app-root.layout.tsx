import Header from '@/components/header/header.tsx';
import { Outlet } from 'react-router';

const AppRootLayout = () => {
  return (
    <>
      <Header />
      
      <div className="my-6">
        <div className="container">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AppRootLayout;