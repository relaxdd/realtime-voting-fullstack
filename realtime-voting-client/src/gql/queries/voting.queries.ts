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
  count: z.number().int(),
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
  query getAllActiveVoting {
    manyVoting(isActive: true) {
      id
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

export const getAllActiveVotingSchema = z.array(votingSchema.pick({
  id: true,
  title: true,
  description: true,
  isActive: true,
  authorId: true,
  votesNumber: true,
  createdAt: true,
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

export const getVotingByIdSchema = votingSchema.pick({
  id: true,
  title: true,
  description: true,
  authorId: true,
  createdAt: true,
  votesNumber: true,
  choices: true,
});