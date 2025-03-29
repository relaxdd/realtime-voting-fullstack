import { gql } from '@apollo/client';

export const createVotingMutation = gql`
  mutation CreateVoting($input: CreateVotingInput!) {
    createVoting(payload: $input) {
      id
    }
  }
`