import { usePreferencesContext } from '@/providers/preferences.provider.tsx';
import { AppLinks } from '@/shared/defines.ts';
import language from '@/shared/language.ts';
import { Card, CardContent } from '@shadcn/card.tsx';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@shadcn/select.tsx';
import { Link } from 'react-router';

const HomeSidebar = () => {
  const [{ lang }] = usePreferencesContext();
  
  return (
    <Card className="py-5">
      <CardContent>
        <div className="mb-3">
          <h2>{language.sidebar[lang]}</h2>
          
          <Link
            to={AppLinks.post}
            className="text-[#ad1619]"
          >
            <small>{language.createNewVoting[lang]}</small>
          </Link>
        </div>
        
        <div className="mb-3">
          <h2>Популярные теги</h2>
          <small>#аниме #разное #кулинария</small>
        </div>
        
        <div>
          <h2 className="mb-2">Категория</h2>
          
          <Select defaultValue="est">
            <SelectTrigger className="w-[100%]">
              <SelectValue placeholder="Select a timezone" />
            </SelectTrigger>
            
            <SelectContent>
              <SelectGroup>
                <SelectLabel>North America</SelectLabel>
                <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
                <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
              </SelectGroup>
              
              <SelectGroup>
                <SelectLabel>Europe & Africa</SelectLabel>
                <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                <SelectItem value="cet">Central European Time (CET)</SelectItem>
                <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
                <SelectItem value="west">
                  Western European Summer Time (WEST)
                </SelectItem>
                <SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
                <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default HomeSidebar;