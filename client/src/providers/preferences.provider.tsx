import { AllowedLanguage, AllowedLanguages } from '@/shared/defines.ts';
import * as React from 'react';

interface IPreferencesState {
  lang: AllowedLanguage;
}

type PreferencesContextDispatch = <K extends keyof IPreferencesState, T extends IPreferencesState[K]>(key: K, value: T) => void
type IPreferencesContext = [IPreferencesState, PreferencesContextDispatch]

const PreferencesContext = React.createContext<IPreferencesContext>(null!);
const usePreferencesContext = () => React.useContext(PreferencesContext);

const PreferencesProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, setState] = React.useState<IPreferencesState>({ lang: getPreferredLanguage() });
  
  function getPreferredLanguage() {
    const allowed = Object.keys(AllowedLanguages) as AllowedLanguages;
    const language = navigator.language.split('-').at(0) || allowed[0];
    
    return (allowed.includes(language) ? language : allowed[0]) as AllowedLanguage;
  }
  
  const dispatch: PreferencesContextDispatch = React.useCallback((key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);
  
  return (
    <PreferencesContext.Provider value={[state, dispatch]}>
      {children}
    </PreferencesContext.Provider>
  );
};

export { usePreferencesContext };
export default PreferencesProvider;