import { FC, useEffect, useRef } from 'react';

interface TgAuthData {
  id: number,
  hash: string,
  username: string,
  authDate: string | null,
  firstName: string | null,
  lastName: string | null,
  photoUrl: string | null
}

interface CustomWindow {
  TelegramLoginWidget: {
    dataOnauth: (user: any) => void
  };
}

declare let window: Window & CustomWindow;

interface TelegramLoginButtonProps {
  botName: string,
  requestAccess?: boolean,
  cornerRadius?: number,
  buttonSize?: 'large' | 'medium' | 'small'
  dataAuthUrl?: string
  dataOnauth?: (user: TgAuthData) => void,
  usePic?: boolean
}

const TelegramLoginButton: FC<TelegramLoginButtonProps> = (
  { buttonSize = 'large', usePic = true, ...props },
) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (ref.current === null) return;
    
    const isDataOnauth = typeof props?.dataOnauth === 'function';
    const isDataAuthUrl = typeof props?.dataAuthUrl === 'string';
    
    if (isDataOnauth) {
      window.TelegramLoginWidget = {
        dataOnauth: ({ id, hash, username, ...user }) => {
          props.dataOnauth!({
            hash, username,
            id: parseInt(id),
            authDate: user?.auth_date || null,
            firstName: user?.first_name || null,
            lastName: user?.last_name || null,
            photoUrl: user?.photo_url || null,
          });
        },
      };
    }
    
    const script = document.createElement('script');
    
    script.async = true;
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    
    script.setAttribute('data-size', buttonSize);
    script.setAttribute('data-userpic', usePic.toString());
    script.setAttribute('data-telegram-login', props.botName);
    
    if (isDataOnauth) {
      script.setAttribute('data-onauth', 'TelegramLoginWidget.dataOnauth(user)');
    }
    
    if (isDataAuthUrl) {
      script.setAttribute('data-auth-url', props.dataAuthUrl as string);
    }
    
    if (props?.requestAccess) script.setAttribute('data-request-access', 'write');
    if (props?.cornerRadius !== undefined) script.setAttribute('data-radius', props.cornerRadius.toString());
    
    ref.current!.appendChild(script);
  }, [buttonSize, usePic, props]);
  
  return (
    <>
      <div ref={ref}></div>
    </>
  );
};

export { type TgAuthData };
export default TelegramLoginButton;