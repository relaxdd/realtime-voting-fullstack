import { useEffect, useRef } from 'react';

const LoginPage = () => {
  const testRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', 'AwennVotingBot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-auth-url', 'http://127.0.0.1');
    script.async = true;
    testRef.current!.appendChild(script);
  }, []);
  
  return (
    <>
      <div ref={testRef}></div>
    </>
  );
};

export default LoginPage;