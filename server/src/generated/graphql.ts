import { GraphQLResolveInfo } from 'graphql';
import { IApolloContext } from '../apollo';
export type Maybe<T> = T extends PromiseLike<infer U> ? Promise<U | null> : T | null;
export type InputMaybe<T> = T extends PromiseLike<infer U> ? Promise<U | null> : T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export const enum IAllowedColor {
  Blue = 'BLUE',
  Green = 'GREEN',
  Red = 'RED'
};

export type IAnswer = {
  __typename?: 'Answer';
  choiceId: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  userId: Scalars['String']['output'];
  votingId: Scalars['String']['output'];
};

export type IAuthorizationInput = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  hash: Scalars['String']['input'];
  id: Scalars['Int']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
  photoUrl?: InputMaybe<Scalars['String']['input']>;
  username: Scalars['String']['input'];
};

export type IChoice = {
  __typename?: 'Choice';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  value: Scalars['String']['output'];
  votes: Scalars['Int']['output'];
  votingId: Scalars['ID']['output'];
};

export type ICreateVotingInput = {
  choices: Array<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  finishIn?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  title: Scalars['String']['input'];
};

export type IDateTime = {
  __typename?: 'DateTime';
  date: Scalars['String']['output'];
  gmt: Scalars['String']['output'];
  iso: Scalars['String']['output'];
  pretty: Scalars['String']['output'];
  time: Scalars['String']['output'];
};

export type IMutation = {
  __typename?: 'Mutation';
  authorization?: Maybe<Scalars['String']['output']>;
  createVoting?: Maybe<IVoting>;
  deleteVoting: Scalars['Boolean']['output'];
};


export type IMutationAuthorizationArgs = {
  payload: IAuthorizationInput;
};


export type IMutationCreateVotingArgs = {
  payload: ICreateVotingInput;
};


export type IMutationDeleteVotingArgs = {
  id: Scalars['ID']['input'];
};

export type IProfile = {
  __typename?: 'Profile';
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
  __typename?: 'Query';
  firstUser?: Maybe<IUser>;
  hello: Scalars['String']['output'];
  manyVoting: Array<IVoting>;
  oneVoting?: Maybe<IVoting>;
};


export type IQueryManyVotingArgs = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  paged?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type IQueryOneVotingArgs = {
  id: Scalars['ID']['input'];
};

export type IUser = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  login: Scalars['String']['output'];
  profile?: Maybe<IProfile>;
  updatedAt: Scalars['String']['output'];
};

export type IVoting = {
  __typename?: 'Voting';
  author: IUser;
  authorId: Scalars['String']['output'];
  choices?: Maybe<Array<IChoice>>;
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



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type IResolversTypes = {
  AllowedColor: IAllowedColor;
  Answer: ResolverTypeWrapper<IAnswer>;
  AuthorizationInput: IAuthorizationInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Choice: ResolverTypeWrapper<IChoice>;
  CreateVotingInput: ICreateVotingInput;
  DateTime: ResolverTypeWrapper<IDateTime>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Profile: ResolverTypeWrapper<IProfile>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  User: ResolverTypeWrapper<IUser>;
  Voting: ResolverTypeWrapper<IVoting>;
};

/** Mapping between all available schema types and the resolvers parents */
export type IResolversParentTypes = {
  Answer: IAnswer;
  AuthorizationInput: IAuthorizationInput;
  Boolean: Scalars['Boolean']['output'];
  Choice: IChoice;
  CreateVotingInput: ICreateVotingInput;
  DateTime: IDateTime;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  Profile: IProfile;
  Query: {};
  String: Scalars['String']['output'];
  User: IUser;
  Voting: IVoting;
};

export type IAnswerResolvers<ContextType = IApolloContext, ParentType extends IResolversParentTypes['Answer'] = IResolversParentTypes['Answer']> = {
  choiceId?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<IResolversTypes['ID'], ParentType, ContextType>;
  userId?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  votingId?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IChoiceResolvers<ContextType = IApolloContext, ParentType extends IResolversParentTypes['Choice'] = IResolversParentTypes['Choice']> = {
  createdAt?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<IResolversTypes['ID'], ParentType, ContextType>;
  label?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  votes?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  votingId?: Resolver<IResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IDateTimeResolvers<ContextType = IApolloContext, ParentType extends IResolversParentTypes['DateTime'] = IResolversParentTypes['DateTime']> = {
  date?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  gmt?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  iso?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  pretty?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  time?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IMutationResolvers<ContextType = IApolloContext, ParentType extends IResolversParentTypes['Mutation'] = IResolversParentTypes['Mutation']> = {
  authorization?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType, RequireFields<IMutationAuthorizationArgs, 'payload'>>;
  createVoting?: Resolver<Maybe<IResolversTypes['Voting']>, ParentType, ContextType, RequireFields<IMutationCreateVotingArgs, 'payload'>>;
  deleteVoting?: Resolver<IResolversTypes['Boolean'], ParentType, ContextType, RequireFields<IMutationDeleteVotingArgs, 'id'>>;
};

export type IProfileResolvers<ContextType = IApolloContext, ParentType extends IResolversParentTypes['Profile'] = IResolversParentTypes['Profile']> = {
  avatarUrl?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<IResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  telegramId?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
  updatedAt?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IQueryResolvers<ContextType = IApolloContext, ParentType extends IResolversParentTypes['Query'] = IResolversParentTypes['Query']> = {
  firstUser?: Resolver<Maybe<IResolversTypes['User']>, ParentType, ContextType>;
  hello?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  manyVoting?: Resolver<Array<IResolversTypes['Voting']>, ParentType, ContextType, Partial<IQueryManyVotingArgs>>;
  oneVoting?: Resolver<Maybe<IResolversTypes['Voting']>, ParentType, ContextType, RequireFields<IQueryOneVotingArgs, 'id'>>;
};

export type IUserResolvers<ContextType = IApolloContext, ParentType extends IResolversParentTypes['User'] = IResolversParentTypes['User']> = {
  createdAt?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<IResolversTypes['ID'], ParentType, ContextType>;
  login?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  profile?: Resolver<Maybe<IResolversTypes['Profile']>, ParentType, ContextType>;
  updatedAt?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IVotingResolvers<ContextType = IApolloContext, ParentType extends IResolversParentTypes['Voting'] = IResolversParentTypes['Voting']> = {
  author?: Resolver<IResolversTypes['User'], ParentType, ContextType>;
  authorId?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  choices?: Resolver<Maybe<Array<IResolversTypes['Choice']>>, ParentType, ContextType>;
  createdAt?: Resolver<IResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  finishIn?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<IResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<IResolversTypes['Boolean'], ParentType, ContextType>;
  shortId?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<IResolversTypes['DateTime'], ParentType, ContextType>;
  votesNumber?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IResolvers<ContextType = IApolloContext> = {
  Answer?: IAnswerResolvers<ContextType>;
  Choice?: IChoiceResolvers<ContextType>;
  DateTime?: IDateTimeResolvers<ContextType>;
  Mutation?: IMutationResolvers<ContextType>;
  Profile?: IProfileResolvers<ContextType>;
  Query?: IQueryResolvers<ContextType>;
  User?: IUserResolvers<ContextType>;
  Voting?: IVotingResolvers<ContextType>;
};

