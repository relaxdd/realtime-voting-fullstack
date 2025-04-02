import http from 'http';
import { join } from 'path';
import * as process from 'process';
import VotingController from '@/modules/voting/voting.controller';
import MutationResolvers from '@/resolvers/mutation.resolvers';
import QueryResolvers from '@/resolvers/query.resolvers';
import UserResolvers from '@/resolvers/user.resolvers';
import VotingResolvers from '@/resolvers/voting.resolvers';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { PrismaClient } from './generated/prisma';
import { IResolvers } from './generated/graphql';
import { loadSchema } from '@graphql-tools/load';
import { JsonFileLoader } from '@graphql-tools/json-file-loader';

export interface IApolloContext {
  currentUser: string | null;
  providers: { prisma: PrismaClient };
  controllers: { voting: VotingController };
}

const getResolvers = (): IResolvers => ({
  Mutation: MutationResolvers,
  Query: QueryResolvers,
  User: UserResolvers,
  Voting: VotingResolvers,
});

async function createApollo(httpServer: http.Server) {
  const schemaPath = join(process.cwd(), '/../shared/graphql.schema.json');
  const typeDefs = await loadSchema(schemaPath, { loaders: [new JsonFileLoader()] });
  
  return new ApolloServer<IApolloContext>({
    typeDefs: typeDefs,
    resolvers: getResolvers(),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
}

export { createApollo };