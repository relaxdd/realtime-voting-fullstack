import { IJwtPayload } from '@/generated/graphql';

interface IEnvironment {
  PORT: number;
  MODE: 'development' | 'production';
  EXPOSE: boolean;
  PGSQL_URL: string;
}

type IJwtUserDto = Omit<IJwtPayload, '__typename' | 'username'> & { username: string }

interface ICandidate {
  firstName: string | null;
  lastName: string | null;
  username: string;
  userId: string;
  telegramId: number;
  avatarUrl: string | null;
}