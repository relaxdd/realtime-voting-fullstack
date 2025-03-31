import { IJwtUserDto } from '@/@types';
import { IApolloContext } from '@/apollo';
import { IAuthorizationInput, IJwtPayload, IMutationResolvers, IVoting } from '@/generated/graphql';
import Replacement from '@/resolvers/replacement';
import { HARD_USER_ID } from '@/shared/defines';
import BadRequestError from '@/shared/error/class/BadRequestError';
import JwtService from '@/shared/services/jwt.service';
import Hex from 'crypto-js/enc-hex';
import hmacSHA256 from 'crypto-js/hmac-sha256';
import sha256 from 'crypto-js/sha256';
import process from 'node:process';
import { v4 as uuidv4 } from 'uuid';
import { camelToSnakeCase, translit } from '@realtime-voting/shared/src/utils/string.utils';

interface ICandidate {
  firstName: string | null;
  lastName: string | null;
  username: string;
  userId: string;
  telegramId: number;
  avatarUrl: string | null;
}

function checkTelegramData(authData: IAuthorizationInput, token: string): boolean {
  if (!token) return false;
  
  const { hash: checkHash, ...verifyData } = authData;
  const oneWeekInSeconds = 60 * 60 * 24 * 7;
  const nowDate = Math.round((new Date()).getTime() / 1000);
  
  if (nowDate > authData.authDate + oneWeekInSeconds) {
    // throw new BadRequestError('Outdated auth data.');
    return false;
  }
  
  const dataCheckArr = Object.entries(verifyData).reduce<string[]>((acc, [key, value]) => {
    const snakeKey = camelToSnakeCase(key);
    acc.push(snakeKey + '=' + String(value));
    return acc;
  }, []);
  
  dataCheckArr.sort();
  console.log(dataCheckArr);
  
  const dataCheckString = dataCheckArr.join('\n');
  const secretKey = sha256(token, { binary: true });
  const hash = Hex.stringify(hmacSHA256(dataCheckString, secretKey));
  
  return checkHash === hash;
}

const MutationResolvers: IMutationResolvers<IApolloContext> = {
  deleteVoting: async (_, { id }, { dataSources }) => {
    const voting = await dataSources.prisma.voting.findUnique({
      where: { id },
      select: { userId: true },
    });
    
    if (!voting || HARD_USER_ID !== voting.userId) return false;
    await dataSources.prisma.voting.delete({ where: { id } });
    
    return true;
  },
  createVoting: async (_, { payload }, { dataSources }) => {
    const {
      description,
      choices,
      finishIn,
      isActive,
      ...otherFields
    } = payload;
    
    const transformChoices = choices.map(label => ({
      label,
      value: translit(label),
    }));
    
    const shortId = (() => {
      const uuid = uuidv4();
      const split = uuid.split('-');
      return split.at(0)! + split.at(-1)!;
    })();
    
    const voting = await dataSources.prisma.voting.create({
      data: {
        shortId,
        userId: HARD_USER_ID,
        description: description || null,
        choices: { createMany: { data: transformChoices } },
        ...otherFields,
        ...(finishIn ? { finishIn } : {}),
        ...(typeof isActive === 'boolean' ? { isActive } : {}),
      },
    });
    
    return Replacement.voting([voting])[0]! as IVoting;
  },
  authorization: async (_, { payload }, { dataSources }) => {
    const token = process.env?.['TG_BOT_TOKEN'] || '';
    
    if (!checkTelegramData(payload, token)) {
      throw new BadRequestError('Невалидные данные аутентификации из telegram');
    }
    
    const {
      username,
      id: telegramId,
      photoUrl = null,
      firstName = null,
      lastName = null,
    } = payload;
    
    const candidate = await dataSources.prisma.profile.findUnique({
      where: { telegramId },
      select: {
        userId: true,
        username: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        telegramId: true,
      },
    }) as ICandidate | null;
    
    let jwtData: IJwtUserDto;
    
    // TODO: Добавить проверку на обновление
    if (candidate)
      jwtData = candidate;
    else {
      const profileData = {
        username,
        lastName,
        firstName,
        telegramId,
        avatarUrl: photoUrl,
      };
      
      // TODO: Если есть JWT достаю и смотрю есть ли юзер в бд, если да то связываю
      const user = await dataSources.prisma.user.create({
        select: {
          id: true,
        },
        data: {
          login: username,
          profile: { create: profileData },
        },
      });
      
      jwtData = { ...profileData, userId: user.id };
    }
    
    const jwtService = new JwtService(process.env?.['JWT_SECRET_KEY']);
    return jwtService.sign(jwtData, '1 week');
  },
};

export default MutationResolvers;