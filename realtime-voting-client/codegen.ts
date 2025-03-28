import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:4242',
  documents: [
    'src/**/*.ts',
    'src/**/*.tsx',
    'src/**/*.gql',
  ],
  generates: {
    'src/gql/generated.ts': {
      // preset: 'client',
      plugins: [
        'typescript',
        'typed-document-node',
        'typescript-operations',
      ],
    },
  },
  config: {
    typesPrefix: 'I',
    constEnums: true,
    enumPrefix: false,
    skipTypename: false,
    nonOptionalTypename: true,
  },
};

export default config;
