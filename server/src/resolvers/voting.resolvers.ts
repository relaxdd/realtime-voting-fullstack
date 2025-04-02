import { IApolloContext } from '@/apollo';
import { IVotingResolvers } from '@/generated/graphql';
import Replacement from '@/resolvers/replacement';
import GraphQLInternalServerError from '@/shared/error/gql-error/GraphQLInternalServerError';

const VotingResolvers: IVotingResolvers<IApolloContext> = {
  author: async (voting, _, { providers }) => {
    const user = await providers.prisma.user.findUnique({
      omit: { password: true },
      where: { id: voting.authorId },
    });
    
    if (!user) {
      throw new GraphQLInternalServerError('У голосования не может не быть автора');
    }
    
    return Replacement.dateToString(user);
  },
  choices: async (voting, _, { providers }) => {
    const choices = await providers.prisma.choice.findMany({
      where: { votingId: voting.id },
      orderBy: { value: 'asc' },
    });
    
    return choices.map(choice => Replacement.dateToString(choice));
  },
  votesNumber: async (voting, _, { providers }) => {
    const choices = await providers.prisma.choice.findMany({
      where: { votingId: voting.id },
      select: { votes: true },
    });
    
    return choices.reduce((acc, it) => acc + it.votes, 0);
  },
};

export default VotingResolvers;