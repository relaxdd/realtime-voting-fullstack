import { gql } from '@apollo/client';

export const createVotingMutation = gql`
  mutation CreateVoting($input: CreateVotingInput!) {
    createVoting(input: $input) {
      id
    }
  }
`;

export const updateVotingMutation = gql`
  mutation UpdateVoting($input: UpdateVotingInput!) {
    updateVoting(input: $input)
  }
`;