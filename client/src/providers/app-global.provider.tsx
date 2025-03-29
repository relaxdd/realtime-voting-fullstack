import { AllowedLanguage, AllowedLanguages } from '@/shared/defines.ts';
import * as React from 'react';

interface IAppGlobalState {
  lang: AllowedLanguage;
}

type GlobalContextDispatch = <K extends keyof IAppGlobalState, T extends IAppGlobalState[K]>(key: K, value: T) => void
type IAppGlobalContext = [IAppGlobalState, GlobalContextDispatch]

const AppGlobalContext = React.createContext<IAppGlobalContext>(null!);
const useAppGlobalContext = () => React.useContext(AppGlobalContext);

const AppGlobalProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, setState] = React.useState<IAppGlobalState>({ lang: getPreferredLanguage() });
  
  function getPreferredLanguage() {
    const allowed = Object.keys(AllowedLanguages) as AllowedLanguages;
    const language = navigator.language.split('-').at(0) || allowed[0];
    
    return (allowed.includes(language) ? language : allowed[0]) as AllowedLanguage;
  }
  
  const dispatch: GlobalContextDispatch = React.useCallback((key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);
  
  return (
    <AppGlobalContext.Provider value={[state, dispatch]}>
      {children}
    </AppGlobalContext.Provider>
  );
};

export { useAppGlobalContext };
export default AppGlobalProvider;