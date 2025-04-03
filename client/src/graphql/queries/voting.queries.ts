import { gql } from '@apollo/client';
import { z } from 'zod';

const dateTimeSchema = z.object({
  iso: z.string().datetime({ precision: 3 }),
  date: z.string().date().optional(),
  time: z.string().time().optional(),
  gmt: z.string().optional(),
  pretty: z.string().optional(),
});

const votingChoiceSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string(),
  votes: z.number().int(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  votingId: z.string().optional(),
});

const votingSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  isActive: z.boolean(),
  finishIn: z.string().nullable(),
  authorId: z.string(),
  votesNumber: z.number().int(),
  createdAt: dateTimeSchema,
  choices: z.array(votingChoiceSchema),
  shortId: z.string(),
  userId: z.string(),
});

/*
 * =================================
 */

export const getAllActiveVotingQuery = gql`
  query GetAllActiveVoting($paged: Int, $limit: Int, $search: String) {
    manyVoting(isActive: true, paged: $paged, limit: $limit, search: $search) {
      id
      shortId
      title
      description
      isActive
      authorId
      createdAt {
        date
        pretty
      }
      votesNumber
    }
  }
`;

export const getVotingByIdQuery = gql`
  query GetVotingById($id: ID!) {
    oneVoting(id: $id) {
      id
      title
      description
      isActive
      authorId
      votesNumber
      choices {
        id
        label
        value
        votes
      }
    }
  }
`;

export const checkAnswerQuery = gql`
  query CheckAnswer($votingId: String!) {
    checkAnswer(votingId: $votingId)
  }
`