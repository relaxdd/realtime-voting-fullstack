import { IApolloContext } from '@/apollo';
import { IVotingResolvers } from '@/generated/graphql';
import Replacement from '@/resolvers/replacement';

const VotingResolvers: IVotingResolvers<IApolloContext> = {
  author: async (voting, _, { dataSources }) => {
    const user = await dataSources.prisma.user.findUnique({
      omit: { password: true },
      where: { id: voting.authorId },
    });
    
    if (!user) {
      throw new TypeError('У голосования не может не быть автора');
    }
    
    return Replacement.dateToString(user);
  },
  choices: async (voting, _, { dataSources }) => {
    const choices = await dataSources.prisma.choice.findMany({
      where: { votingId: voting.id },
      orderBy: { value: 'asc' },
    });
    
    return choices.map(choice => Replacement.dateToString(choice));
  },
  votesNumber: async (voting, _, { dataSources }) => {
    const choices = await dataSources.prisma.choice.findMany({
      where: { votingId: voting.id },
      select: { votes: true },
    });
    
    return choices.reduce((acc, it) => acc + it.votes, 0);
  },
};

export default VotingResolvers;