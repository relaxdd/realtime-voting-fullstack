import type { ICandidate, IJwtUserDto } from '@/@types';
import { IApolloContext } from '@/apollo';
import { IMutationResolvers, IVoting } from '@/generated/graphql';
import Replacement from '@/resolvers/replacement';
import GraphQLBadRequestError from '@/shared/error/gql-error/GraphQLBadRequestError';
import GraphQLForbiddenError from '@/shared/error/gql-error/GraphQLForbiddenError';
import GraphQLUnauthorizedError from '@/shared/error/gql-error/GraphQLUnauthorizedError';
import { checkTelegramData } from '@/shared/helpers';
import JwtService from '@/shared/services/jwt.service';
import process from 'node:process';
import { v4 as uuidv4 } from 'uuid';
import { translit } from '@realtime-voting/shared/src/utils/string.utils';

const MutationResolvers: IMutationResolvers<IApolloContext> = {
  async authSignIn(_, { input }, { providers }) {
    const token = process.env?.['TG_BOT_TOKEN'] || '';
    
    if (!checkTelegramData(input, token)) {
      throw new GraphQLBadRequestError('Невалидные данные аутентификации из telegram');
    }
    
    const {
      username,
      id: telegramId,
      photoUrl = null,
      firstName = null,
      lastName = null,
    } = input;
    
    const candidate = await providers.prisma.profile.findUnique({
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
        telegramId,
        lastName,
        firstName,
        avatarUrl: photoUrl,
      };
      
      // TODO: Если есть JWT достаю и смотрю есть ли юзер в бд, если да то связываю
      const user = await providers.prisma.user.create({
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
    
    const jwtService = new JwtService('JWT_SECRET_KEY');
    
    return {
      user: jwtData,
      jwt: jwtService.sign(jwtData, '1 week'),
    };
  },
  async deleteVoting(_, { id }, { providers, currentUser }) {
    if (!currentUser) {
      throw new GraphQLUnauthorizedError('User is not authenticated');
    }
    
    const voting = await providers.prisma.voting.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });
    
    if (!voting) {
      return true;
    }
    
    if (currentUser !== voting.userId) {
      throw new GraphQLForbiddenError('Access denied for this user');
    }
    
    await providers.prisma.$transaction([
      providers.prisma.answer.deleteMany({ where: { votingId: voting.id } }),
      providers.prisma.choice.deleteMany({ where: { votingId: voting.id } }),
      providers.prisma.voting.delete({ where: { id: voting.id } }),
    ]);
    
    return true;
  },
  async createVoting(_, { input: { user, ...input } }, { providers, currentUser }) {
    if (!currentUser) {
      throw new GraphQLUnauthorizedError('User is not authenticated');
    }
    
    if (currentUser !== user) {
      throw new GraphQLBadRequestError('Passed incorrect userId');
    }
    
    const {
      description,
      choices,
      finishIn,
      isActive,
      ...otherFields
    } = input;
    
    const transformChoices = choices.map(label => ({
      label,
      value: translit(label),
    }));
    
    const shortId = (() => {
      const uuid = uuidv4();
      const split = uuid.split('-');
      return split.at(0)! + split.at(-1)!;
    })();
    
    const voting = await providers.prisma.voting.create({
      data: {
        shortId,
        userId: currentUser,
        description: description || null,
        choices: { createMany: { data: transformChoices } },
        ...otherFields,
        ...(finishIn ? { finishIn } : {}),
        ...(typeof isActive === 'boolean' ? { isActive } : {}),
      },
    });
    
    return Replacement.voting([voting])[0]! as IVoting;
  },
  async updateVoting(_, { input }, { providers, controllers, currentUser }) {
    if (!currentUser) {
      throw new GraphQLUnauthorizedError('User is not authenticated');
    }
    
    const choice = await providers.prisma.choice.findFirst({
      where: { value: input.choiceName },
      select: { id: true, votes: true },
    });
    
    if (!choice) return false;
    
    let answersNumber = await providers.prisma.answer.count({
      where: { userId: currentUser, votingId: input.votingId },
    });
    
    if (answersNumber !== 0) return false;
    
    await providers.prisma.answer.create({
      data: {
        userId: currentUser,
        choiceId: choice.id,
        votingId: input.votingId,
      },
    });
    
    answersNumber = await providers.prisma.answer.count({
      where: { choiceId: choice.id },
    });
    
    await providers.prisma.choice.update({
      where: { id: choice.id },
      data: { votes: answersNumber },
    });
    
    controllers.voting.notify(input.shortId);
    return true;
  },
};

export default MutationResolvers;