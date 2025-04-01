import { IJwtPayload } from '@/graphql/generated.ts';
import { gql } from '@apollo/client';
import { z } from 'zod';

export const validateAuthQuery = gql`
  query ValidateAuth($jwt: String!) {
    validateAuth(jwt: $jwt) {
      userId
      telegramId
      username
      firstName
      lastName
      avatarUrl
    }
  }
`;

export const validateAuthSchema = z.union([
  z.null(),
  z.undefined(),
  z.object({
    username: z.string(),
    userId: z.string().uuid(),
    telegramId: z.number().int(),
    firstName: z.string().nullish().transform(it => it || null),
    lastName: z.string().nullish().transform(it => it || null),
    avatarUrl: z.string().nullish().transform(it => it || null),
  }),
]).transform(it => it || null);

export const verifyJwtPayload = (jwtPayload: IJwtPayload | null | undefined) => {
  const result = validateAuthSchema.safeParse(jwtPayload);
  
  if (!result.success || result.error) {
    console.warn(result.error.message);
    return null;
  }
  
  return result.data;
};