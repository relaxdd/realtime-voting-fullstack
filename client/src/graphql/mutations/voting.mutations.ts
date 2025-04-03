import { gql } from '@apollo/client';

export const createVotingMutation = gql`
  mutation CreateVoting($input: CreateVotingInput!) {
    createVoting(input: $input) {
      id
      shortId
    }
  }
`;

export const updateVotingMutation = gql`
  mutation UpdateVoting($input: UpdateVotingInput!) {
    updateVoting(input: $input)
  }
`;

export const deleteVotingMutation = gql`
  mutation DeleteVoting($id: ID!) {
    deleteVoting(id: $id)
  }
`

export const completeVotingMutation = gql`
  mutation CompleteVoting($id: ID!) {
    completeVoting(id: $id)
  }
`