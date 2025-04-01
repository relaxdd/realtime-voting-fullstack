import TelegramLoginButton, { TgAuthData } from '@/components/telegram-login-button.tsx';
import { AuthSignInDocument } from '@/graphql/generated.ts';
import { verifyJwtPayload } from '@/graphql/queries/auth.queries.ts';
import { useAuthContext } from '@/providers/auth-provider.tsx';
import { AppLinks } from '@/shared/defines.ts';
import { useMutation } from '@apollo/client';
import { Navigate } from 'react-router';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';

const tgAuthDataSchema = z.object({
  hash: z.string(),
  id: z.number().int(),
  username: z.string(),
  authDate: z.number().int(),
  lastName: z.string().nullish(),
  firstName: z.string().nullish(),
  photoUrl: z.union([z.literal(''), z.string().url().nullish()]),
});

const LoginPage = () => {
  const { user, login } = useAuthContext();
  
  const [authSignIn, { loading }] = useMutation(AuthSignInDocument);
  
  async function onAuthHandler(user: TgAuthData) {
    const validate = tgAuthDataSchema.safeParse(user);
    
    if (validate.error) {
      const validationError = fromError(validate.error);
      console.warn(validationError.toString());
      alert('Не валидные данные от telegram.');
      
      return;
    }
    
    await authSignIn({
      variables: {
        input: validate.data,
      },
      onError: (err) => {
        console.error(err);
        alert('Во время запроса произошла ошибка.');
      },
      onCompleted: ({ authSignIn }) => {
        const jwt = authSignIn?.jwt || '';
        const user = verifyJwtPayload(authSignIn?.user);
        
        if (!user || !jwt) {
          alert('Сервер вернул не корректные данные.');
          return;
        }
        
        login({ user, jwt });
      },
    });
  }
  
  if (loading) {
    return <h1>Ожидайте, данные проверяются...</h1>;
  }
  
  if (user !== null) {
    return <Navigate to={AppLinks.root} />;
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