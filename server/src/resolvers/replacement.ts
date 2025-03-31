import { IDateTime } from '@/generated/graphql';
import { Voting } from '@/generated/prisma';
import { getDateTime } from '@/shared/utils/date.utils';

type IPreparedVoting = Omit<Voting, 'userId' | 'createdAt' | 'updatedAt' | 'finishIn'> & {
  shortId: string
  authorId: string
  createdAt: IDateTime
  updatedAt: IDateTime
  finishIn: string | null
}

const Replacement = {
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

export default Replacement;