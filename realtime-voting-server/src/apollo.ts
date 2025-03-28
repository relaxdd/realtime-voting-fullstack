import * as http from 'http'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { ApolloServer } from '@apollo/server'
import gql from 'graphql-tag'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import jsonData from './db.json'
import { IDateTime, IProfile, IResolvers, IUser, IVoting } from './generated/graphql'
import { Prisma, PrismaClient, Voting } from '@prisma/client'

export type JsonData = typeof jsonData

export interface IApolloContext {
  dataSources: {
    jsonData: JsonData
    prisma: PrismaClient
  }
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

function getDateTime(dateString: Date | string | null = null) {
  const date = (() => {
    if (!dateString) return new Date()
    else if (typeof dateString === 'string') return new Date(dateString)
    else return dateString
  })()

  return {
    iso: date.toISOString(),
    gmt: date.toUTCString(),
    pretty: date.toLocaleString(),
  }
}

const replacment = {
  voting(list: Voting[]): IPreparedVoting[] {
    return list.map(({ userId, createdAt, updatedAt, ...data }) => {
      const split = data.id.split('-')

      return {
        ...data,
        authorId: userId,
        createdAt: getDateTime(createdAt),
        updatedAt: getDateTime(updatedAt),
        shortId: split.at(0)! + split.at(-1)!,
      }
    })
  },
}

const getResolvers = (): IResolvers => ({
  Query: {
    hello: () => 'Hello world!',
    // TODO: Поменял на Prisma
    firstUser: async (_, __, { dataSources: { prisma } }) => {
      const user = await prisma.user.findFirst({ omit: { password: true } })
      return user as unknown as IUser
    },
    // TODO: Поменял на Prisma
    oneVoting: async (_, args, { dataSources }) => {
      const found = await dataSources.prisma.voting.findUnique({ where: { id: args.id } })
      if (!found) return null
      return replacment.voting([found])[0]! as IVoting
    },
    // TODO: Поменял на Prisma
    manyVoting: async (_, args, { dataSources }) => {
      const limit = args?.limit || 15
      const paged = args?.paged || 1
      const skip = limit * (paged - 1)

      const where: Prisma.VotingWhereInput = {}
      if (!Object.hasOwn(args, 'isActive')) where['isActive'] = Boolean(args.isActive)

      const allVoting = await dataSources.prisma.voting.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      })

      return replacment.voting(allVoting) as IVoting[]
    },
  },
  User: {
    profile: async (user, _, { dataSources }) => {
      const profile = await dataSources.prisma.profile.findFirst({ where: { userId: user.id } })
      return profile as unknown as IProfile
    },
  },
  Voting: {
    author: (voting, _, { dataSources }) => {
      return dataSources.jsonData.users.find((it) => it.id === voting.authorId)!
    },
    choices: (voting, _, { dataSources }) => {
      return dataSources.jsonData.votingChoices.filter((it) => it.votingId === voting.id)
    },
    votesNumber: (voting, _, { dataSources }) => {
      const found = dataSources.jsonData.votingChoices.filter((it) => it.votingId === voting.id)
      return found.reduce((acc, it) => acc + it.count, 0)
    },
  },
})

function createApollo(httpServer: http.Server) {
  const typeDefs = gql(readFileSync(resolve(__dirname, 'schema.gql'), { encoding: 'utf-8' }))

  const server = new ApolloServer<IApolloContext>({
    typeDefs,
    resolvers: getResolvers(),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  return server
}

export { createApollo }
