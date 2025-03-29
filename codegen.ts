import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: './shared/schema.graphql',
  ignoreNoDocuments: true,
  documents: [
    'client/src/graphql/**/*.ts',
    'client/src/graphql/**/*.tsx',
    'client/src/graphql/**/*.gql',
  ],
  generates: {
    './client/src/graphql/generated.ts': {
      plugins: [
        'typescript',
        'typed-document-node',
        'typescript-operations',
      ],
      config: {
        typesPrefix: 'I',
        constEnums: true,
        enumPrefix: false,
        skipTypename: false,
        nonOptionalTypename: true,
      },
    },
    './server/src/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-resolvers',
      ],
      config: {
        typesPrefix: 'I',
        constEnums: true,
        contextType: '../apollo#IApolloContext',
        maybeValue: 'T extends PromiseLike<infer U> ? Promise<U | null> : T | null',
      },
    },
    './shared/graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
};

export default config;