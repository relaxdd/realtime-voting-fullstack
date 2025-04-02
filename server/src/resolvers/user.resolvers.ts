import { IApolloContext } from '@/apollo';
import { IUserResolvers } from '@/generated/graphql';
import Replacement from '@/resolvers/replacement';

const UserResolvers: IUserResolvers<IApolloContext> = {
  profile: async (user, _, { providers }) => {
    const profile = await providers.prisma.profile.findFirst({ where: { userId: user.id } });
    return profile ? Replacement.dateToString(profile) : null;
  },
}

export default UserResolvers;