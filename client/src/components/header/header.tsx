import { AppLinks } from '@/shared/defines.ts';
import { Link } from 'react-router';
import HeaderLangToggle from '@/components/header/header-right/header-lang-toggle.tsx';
import HeaderLoginArea from '@/components/header/header-right/header-login-area.tsx';
import HeaderSearchForm from '@/components/header/header-right/header-search-form.tsx';

const Header = () => {
  return (
    <header className="bg-accent">
      <div className="container">
        <div className="py-4 flex flex-row justify-between items-center">
          <div>
            <Link to={AppLinks.root} className="text-[20px] text-[#ad1619]">RealTime Voting</Link>
          </div>
          
          <div className="flex flex-row items-center gap-x-4">
            <HeaderLangToggle />
            <HeaderSearchForm />
            <HeaderLoginArea />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;