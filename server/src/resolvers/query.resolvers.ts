import { IApolloContext } from '@/apollo';
import { IQueryResolvers, IUser, IVoting } from '@/generated/graphql';
import { Prisma } from '@/generated/prisma';
import Replacement from '@/resolvers/replacement';
import JwtService from '@/shared/services/jwt.service';

const QueryResolvers: IQueryResolvers<IApolloContext> = {
  firstUser: async (_, __, { providers: { prisma } }) => {
    const user = await prisma.user.findFirst({ omit: { password: true } });
    return user as unknown as IUser;
  },
  checkAnswer: async (_, { votingId }, { providers, currentUser }) => {
    if (!currentUser) return false;
    
    const answersNumber = await providers.prisma.answer.count({
      where: { userId: currentUser, votingId },
    });
    
    return answersNumber !== 0;
  },
  oneVoting: async (_, args, { providers }) => {
    let voting = null;
    
    if (args.id.length === 20) {
      voting = await providers.prisma.voting.findFirst({ where: { shortId: args.id } });
    } else {
      voting = await providers.prisma.voting.findUnique({ where: { id: args.id } });
    }
    
    if (!voting) return null;
    return Replacement.voting([voting])[0]! as IVoting;
  },
  manyVoting: async (_, args, { providers }) => {
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
    
    const allVoting = await providers.prisma.voting.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    
    return Replacement.voting(allVoting) as IVoting[];
  },
  validateAuth: (_, { jwt }) => {
    return (new JwtService('JWT_SECRET_KEY')).verify(jwt);
  },
};

export default QueryResolvers;