import { useAppGlobalContext } from '@/providers/app-global.provider.tsx';
import { AllowedLanguage, AllowedLanguages } from '@/shared/defines.ts';
import language from '@/shared/language.ts';
import { Link, Outlet, useSearchParams } from 'react-router';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';


const RootLayout = () => {
  const [{ lang }, dispatch] = useAppGlobalContext();
  const [searchParams, setSearchParams] = useSearchParams({ s: '' });
  
  return (
    <>
      <header className="bg-accent">
        <div className="container">
          <div className="py-4 flex flex-row justify-between items-center">
            <div className="">
              <Link to="/" className="text-[20px]">RealTime Voting</Link>
            </div>
            
            <div className="flex flex-row items-center gap-x-3">
              <Select
                defaultValue={lang}
                onValueChange={(value) => {
                  dispatch('lang', value as AllowedLanguage);
                }}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                
                <SelectContent>
                  {Object.entries(AllowedLanguages).map(([value, label]) => (
                    <SelectItem value={value} key={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <form action="/">
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
            </div>
          </div>
        </div>
      </header>
      
      <div className="my-6">
        <div className="container">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default RootLayout;