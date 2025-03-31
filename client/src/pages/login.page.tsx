import TelegramLoginButton, { TgUser } from '@/components/telegram-login-button.tsx';
import { useAuthContext } from '@/providers/auth-provider.tsx';
import { Navigate } from 'react-router';

const LoginPage = () => {
  const { user } = useAuthContext();
  
  function onAuthHandler(user: TgUser) {
    console.log(user);
  }
  
  if (user !== null) {
    return <Navigate to="/" />;
  }
  
  return (
    <TelegramLoginButton
      botName="AwennVotingBot"
      dataOnauth={onAuthHandler}
      dataAuthUrl="http://127.0.0.1"
    />
  );
};

export default LoginPage;