import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export const enum AllowedColor {
  Blue = 'BLUE',
  Green = 'GREEN',
  Red = 'RED'
};

export type IDateTime = {
  __typename: 'DateTime';
  date: Scalars['String']['output'];
  gmt: Scalars['String']['output'];
  iso: Scalars['String']['output'];
  pretty: Scalars['String']['output'];
  time: Scalars['String']['output'];
};

export type IProfile = {
  __typename: 'Profile';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  telegramId?: Maybe<Scalars['Int']['output']>;
  updatedAt: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type IQuery = {
  __typename: 'Query';
  firstUser?: Maybe<IUser>;
  hello: Scalars['String']['output'];
  manyVoting: Array<IVoting>;
  oneVoting?: Maybe<IVoting>;
};


export type IQueryManyVotingArgs = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  paged?: InputMaybe<Scalars['Int']['input']>;
};


export type IQueryOneVotingArgs = {
  id: Scalars['ID']['input'];
};

export type IUser = {
  __typename: 'User';
  createdAt: Scalars['String']['output'];
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  login: Scalars['String']['output'];
  profile?: Maybe<IProfile>;
  updatedAt: Scalars['String']['output'];
};

export type IVoting = {
  __typename: 'Voting';
  author: IUser;
  authorId: Scalars['String']['output'];
  choices?: Maybe<Array<IVotingChoice>>;
  createdAt: IDateTime;
  description?: Maybe<Scalars['String']['output']>;
  finishIn?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  shortId: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: IDateTime;
  votesNumber: Scalars['Int']['output'];
};

export type IVotingChoice = {
  __typename: 'VotingChoice';
  count: Scalars['Int']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  value: Scalars['String']['output'];
  votingId: Scalars['ID']['output'];
};


export const GetAllActiveVotingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllActiveVoting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"manyVoting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"isActive"},"value":{"kind":"BooleanValue","value":true}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"authorId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"pretty"}}]}},{"kind":"Field","name":{"kind":"Name","value":"votesNumber"}}]}}]}}]} as unknown as DocumentNode<IGetAllActiveVotingQuery, IGetAllActiveVotingQueryVariables>;
export const GetVotingByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getVotingById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"oneVoting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"authorId"}},{"kind":"Field","name":{"kind":"Name","value":"votesNumber"}},{"kind":"Field","name":{"kind":"Name","value":"choices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<IGetVotingByIdQuery, IGetVotingByIdQueryVariables>;
export type IGetAllActiveVotingQueryVariables = Exact<{ [key: string]: never; }>;


export type IGetAllActiveVotingQuery = { __typename: 'Query', manyVoting: Array<{ __typename: 'Voting', id: string, title: string, description?: string | null, isActive: boolean, authorId: string, votesNumber: number, createdAt: { __typename: 'DateTime', date: string, pretty: string } }> };

export type IGetVotingByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type IGetVotingByIdQuery = { __typename: 'Query', oneVoting?: { __typename: 'Voting', id: string, title: string, description?: string | null, authorId: string, votesNumber: number, choices?: Array<{ __typename: 'VotingChoice', id: string, label: string, value: string, count: number }> | null } | null };
