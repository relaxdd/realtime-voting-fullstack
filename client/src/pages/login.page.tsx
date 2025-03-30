import TelegramLoginButton, { TgUser } from '@/components/telegram-login-button.tsx';

const LoginPage = () => {
  
  function onAuthHandler(user: TgUser) {
    console.log(user);
  }
  
  return (
    <TelegramLoginButton
      botName="AwennVotingBot"
      dataOnauth={onAuthHandler}
    />
  );
};

export default LoginPage;