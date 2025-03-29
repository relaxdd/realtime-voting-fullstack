import { FC, PropsWithChildren } from 'react';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="container">
      {children}
    </div>
  );
};

export default Layout;