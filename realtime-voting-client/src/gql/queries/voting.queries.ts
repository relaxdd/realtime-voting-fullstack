import { gql } from '@apollo/client';
import { z } from 'zod';

export const getAllActiveVotingQuery = gql`
  query getAllActiveVoting {
    manyVoting(isActive: true) {
      id
      title
      description
      isActive
      authorId
      createdAt
      votesNumber
    }
  }
`;

export const getAllActiveVotingSchema = z.array(z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  isActive: z.boolean(),
  authorId: z.string(),
  createdAt: z.coerce.date(),
  votesNumber: z.number().int(),
}));

/*
 * =================================
 */

export const getVotingByIdQuery = gql`
  query getVotingById($id: ID!) {
    oneVoting(id: $id) {
      id
      title
      description
      authorId
      createdAt
      votesNumber
      choices {
        id
        label
        value
        count
      }
    }
  }
`;

export const getVotingByIdSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  authorId: z.string(),
  createdAt: z.coerce.date(),
  votesNumber: z.number().int(),
  choices: z.array(z.object({
    id: z.string(),
    label: z.string(),
    value: z.string(),
    count: z.number().int(),
  })),
});

/*
 * =================================
 */