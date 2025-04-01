import { usePreferencesContext } from '@/providers/preferences.provider.tsx';
import { AllowedLanguage, AllowedLanguages } from '@/shared/defines.ts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shadcn/select.tsx';

const HeaderLangToggle = () => {
  const [{ lang }, dispatch] = usePreferencesContext();
  
  return (
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
  );
};

export default HeaderLangToggle;