import { Button } from '@shadcn/button.tsx';
import { Input } from '@shadcn/input.tsx';
import { usePreferencesContext } from '@/providers/preferences.provider.tsx';
import language from '@/shared/language.ts';
import { Search, X } from 'lucide-react';
import { FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

const HeaderSearchForm = () => {
  const navigate = useNavigate();
  const [{ lang }] = usePreferencesContext();
  const [searchParams, setSearchParams] = useSearchParams({ s: '' });
  
  function onSubmitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const searchQuery = String(formData.get('s') ?? '').trim();
    
    if (window.location.pathname !== '/') {
      navigate('/');
    }
    
    setSearchParams({ s: searchQuery });
  }
  
  return (
    <form onSubmit={onSubmitHandler}>
      <div className="flex flex-row gap-x-2">
        <div className="relative flex items-center">
          <Input
            name="s"
            required
            className="bg-white"
            placeholder={language.search[lang]}
            defaultValue={searchParams.get('s') ?? ''}
          />
          
          {searchParams.get('s') && (
            <Button
              type="reset"
              variant="ghost"
              className="absolute right-0"
              onClick={() => {
                setSearchParams({});
              }}
            >
              <X />
            </Button>
          )}
        </div>
        
        <Button type="submit">
          <Search />
        </Button>
      </div>
    </form>
  );
};

export default HeaderSearchForm;