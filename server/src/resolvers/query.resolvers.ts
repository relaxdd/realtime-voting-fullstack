import { IApolloContext } from '@/apollo';
import { IQueryResolvers, IUser, IVoting } from '@/generated/graphql';
import { Prisma } from '@/generated/prisma';
import Replacement from '@/resolvers/replacement';
import JwtService from '@/shared/services/jwt.service';
import * as JWT from 'jsonwebtoken';
import process from 'node:process';

const QueryResolvers: IQueryResolvers<IApolloContext> = {
  firstUser: async (_, __, { dataSources: { prisma } }) => {
    const user = await prisma.user.findFirst({ omit: { password: true } });
    return user as unknown as IUser;
  },
  oneVoting: async (_, args, { dataSources }) => {
    let voting = null;
    
    if (args.id.length === 20) {
      voting = await dataSources.prisma.voting.findFirst({ where: { shortId: args.id } });
    } else {
      voting = await dataSources.prisma.voting.findUnique({ where: { id: args.id } });
    }
    
    if (!voting) return null;
    return Replacement.voting([voting])[0]! as IVoting;
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
    
    return Replacement.voting(allVoting) as IVoting[];
  },
  validateAuth: (_, { jwt }) => {
    const jwtService = new JwtService(process.env?.['JWT_SECRET_KEY']);
    const result = jwtService.verify(jwt);
    return result !== false ? result : null;
  },
};

export default QueryResolvers;