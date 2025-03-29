import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { Prisma, PrismaClient, Voting } from '@prisma/client';
import { readFileSync } from 'fs';
import gql from 'graphql-tag';
import * as http from 'http';
import { resolve } from 'path';
import jsonData from './db.json';
import { IDateTime, IResolvers, IUser, IVoting } from './generated/graphql';

export type JsonData = typeof jsonData

export interface IApolloContext {
  dataSources: {
    jsonData: JsonData
    prisma: PrismaClient
  };
}

type IPreparedVoting = Omit<Voting, 'userId' | 'createdAt' | 'updatedAt'> & {
  shortId: string
  authorId: string
  createdAt: IDateTime
  updatedAt: IDateTime
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
    return list.map(({ userId, createdAt, updatedAt, ...data }) => {
      const split = data.id.split('-');
      
      return {
        ...data,
        authorId: userId,
        createdAt: getDateTime(createdAt),
        updatedAt: getDateTime(updatedAt),
        shortId: split.at(0)! + split.at(-1)!,
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

const getResolvers = (): IResolvers => ({
  Query: {
    // TODO: Поменял на Prisma
    firstUser: async (_, __, { dataSources: { prisma } }) => {
      const user = await prisma.user.findFirst({ omit: { password: true } });
      return user as unknown as IUser;
    },
    // TODO: Поменял на Prisma
    oneVoting: async (_, args, { dataSources }) => {
      const found = await dataSources.prisma.voting.findUnique({ where: { id: args.id } });
      if (!found) return null;
      return replacement.voting([found])[0]! as IVoting;
    },
    // TODO: Поменял на Prisma
    manyVoting: async (_, args, { dataSources }) => {
      const limit = args?.limit || 15;
      const paged = args?.paged || 1;
      const skip = limit * (paged - 1);
      
      const where: Prisma.VotingWhereInput = {};
      if (!Object.hasOwn(args, 'isActive')) where['isActive'] = Boolean(args.isActive);
      
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
    // TODO: Поменял на Prisma
    profile: async (user, _, { dataSources }) => {
      const profile = await dataSources.prisma.profile.findFirst({ where: { userId: user.id } });
      return profile ? replacement.dateToString(profile) : null;
    },
  },
  Voting: {
    // TODO: Поменял на Prisma
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
    choices: (voting, _, { dataSources }) => {
      // const choices = await dataSources.prisma.votingChoice
      return dataSources.jsonData.votingChoices.filter((it) => it.votingId === voting.id);
    },
    votesNumber: (voting, _, { dataSources }) => {
      const found = dataSources.jsonData.votingChoices.filter((it) => it.votingId === voting.id);
      return found.reduce((acc, it) => acc + it.count, 0);
    },
  },
});

function createApollo(httpServer: http.Server) {
  const typeDefs = gql(readFileSync(resolve(__dirname, 'schema.gql'), { encoding: 'utf-8' }));

  return new ApolloServer<IApolloContext>({
    typeDefs,
    resolvers: getResolvers(),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
}

export { createApollo };
