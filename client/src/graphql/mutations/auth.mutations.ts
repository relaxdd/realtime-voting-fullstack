import { gql } from '@apollo/client';

export const authSingInQuery = gql`
  mutation AuthSignIn($input: AuthSignInInput!) {
    authSignIn(input: $input) {
      jwt
      user {
        userId
        telegramId
        username
        firstName
        lastName
        avatarUrl
      }
    }
  }
`