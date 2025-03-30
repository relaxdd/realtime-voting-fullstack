import http from 'http';
import path from 'path';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { Prisma, PrismaClient, Voting } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { IDateTime, IResolvers, IUser, IVoting } from './generated/graphql';
import { loadSchema } from '@graphql-tools/load';
import { JsonFileLoader } from '@graphql-tools/json-file-loader';
import { translit } from '@realtime-voting/shared/src/utils/string.utils';

export interface IApolloContext {
  dataSources: {
    prisma: PrismaClient
  };
}

type IPreparedVoting = Omit<Voting, 'userId' | 'createdAt' | 'updatedAt' | 'finishIn'> & {
  shortId: string
  authorId: string
  createdAt: IDateTime
  updatedAt: IDateTime
  finishIn: string | null
}

/*
 * =====================================================
 */

function getPrettyDateTime(dateObj: Date): string {
  const date = dateObj.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const time = dateObj.toLocaleTimeString('ru-RU', {
    hour: 'numeric',
    minute: 'numeric',
  });
  
  return `${date} в ${time}`;
}

function getDateTime(dateString: Date | string | null = null) {
  const dateObj = (() => {
    if (!dateString) return new Date();
    else if (typeof dateString === 'string') return new Date(dateString);
    else return dateString;
  })();
  
  const iso = dateObj.toISOString();
  const [date, time] = iso.split('T') as [string, string];
  
  return {
    iso,
    date,
    time: time.slice(0, 8),
    gmt: dateObj.toUTCString(),
    pretty: getPrettyDateTime(dateObj),
  };
}

const replacement = {
  voting(list: Voting[]): IPreparedVoting[] {
    return list.map(({ userId, createdAt, updatedAt, finishIn, ...data }) => {
      return {
        ...data,
        authorId: userId,
        createdAt: getDateTime(createdAt),
        updatedAt: getDateTime(updatedAt),
        finishIn: finishIn ? finishIn.toISOString() : null,
      };
    });
  },
  dateToString<T extends Record<'createdAt' | 'updatedAt', Date>>(object: T) {
    const { createdAt, updatedAt, ...otherData } = object;
    
    return {
      ...otherData,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    };
  },
};

const HARD_USER_ID = '0bf9ebcf-c1cf-421e-8223-5c4b5fb94c98';

const getResolvers = (): IResolvers => ({
  Mutation: {
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
      
      return replacement.voting([voting])[0]! as IVoting;
    },
    authorization: async (_, { payload }, { dataSources }) => {
      // TODO: Проверить hash
      
      const { id, username, hash, photoUrl = null, ...profile } = payload;
      
      const candidate = await dataSources.prisma.profile.findUnique({
        select: { userId: true },
        where: { telegramId: id,  },
      });
      
      let jwtData: any;
      let userId: string;
      
      /*
       * TODO: Вынести данные тг в отдельную таблицу с ID = TelegramID ???
       * TODO: Добавить туда колонку username так как он может отличаться от бдшного
       */
      if (candidate) {
        jwtData = {
          userId: candidate.userId,
          // TODO: Данные из профиля, username, avatarUrl и displayName
        };
      } else {
        // TODO: Если есть JWT достаю и смотрю есть ли юзер в бд, если да то связываю
        const user = await dataSources.prisma.user.create({
          select: {
            id: true,
          },
          data: {
            login: username,
            profile: {
              create: {
                ...profile,
                telegramId: id,
                avatarUrl: photoUrl,
              },
            },
          },
        });
      }
      
      // TODO: Next iteration...
    },
  },
  Query: {
    firstUser: async (_, __, { dataSources: { prisma } }) => {
      const user = await prisma.user.findFirst({ omit: { password: true } });
      return user as unknown as IUser;
    },
    oneVoting: async (_, args, { dataSources }) => {
      let voting = null;
      
      if (args.id.length === 20)
        voting = await dataSources.prisma.voting.findFirst({ where: { shortId: args.id } });
      else
        voting = await dataSources.prisma.voting.findUnique({ where: { id: args.id } });
      
      if (!voting) return null;
      return replacement.voting([voting])[0]! as IVoting;
    },
    manyVoting: async (_, args, { dataSources }) => {
      const limit = args?.limit || 15;
      const paged = args?.paged || 1;
      const skip = limit * (paged - 1);
      
      const where: Omit<Prisma.VotingWhereInput, 'AND'> & { AND: Prisma.VotingWhereInput[] } = {
        AND: [],
      };
      
      if ('isActive' in args && typeof args.isActive === 'boolean') {
        where.AND.push({ isActive: args.isActive! });
      }
      
      if ('search' in args && args.search) {
        where.AND.push({
          OR: args.search!.split(' ').map((contains) => ({
            title: { contains, mode: 'insensitive' },
          })),
        });
      }
      
      const allVoting = await dataSources.prisma.voting.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });
      
      return replacement.voting(allVoting) as IVoting[];
    },
  },
  User: {
    profile: async (user, _, { dataSources }) => {
      const profile = await dataSources.prisma.profile.findFirst({ where: { userId: user.id } });
      return profile ? replacement.dateToString(profile) : null;
    },
  },
  Voting: {
    author: async (voting, _, { dataSources }) => {
      const user = await dataSources.prisma.user.findUnique({
        omit: { password: true },
        where: { id: voting.authorId },
      });
      
      if (!user) {
        throw new TypeError('У голосования не может не быть автора');
      }
      
      return replacement.dateToString(user);
    },
    choices: async (voting, _, { dataSources }) => {
      const choices = await dataSources.prisma.choice.findMany({ where: { votingId: voting.id } });
      return choices.map(choice => replacement.dateToString(choice));
    },
    votesNumber: async (voting, _, { dataSources }) => {
      const choices = await dataSources.prisma.choice.findMany({
        where: { votingId: voting.id },
        select: { votes: true },
      });
      
      return choices.reduce((acc, it) => acc + it.votes, 0);
    },
  },
});

async function createApollo(httpServer: http.Server) {
  const schemaPath = path.join(process.cwd(), '/../shared/graphql.schema.json');
  const typeDefs = await loadSchema(schemaPath, { loaders: [new JsonFileLoader()] });
  
  return new ApolloServer<IApolloContext>({
    typeDefs: typeDefs,
    resolvers: getResolvers(),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
}

export { createApollo };
