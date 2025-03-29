import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:4242',
  documents: [
    'src/**/*.ts',
    'src/**/*.tsx',
    'src/**/*.gql',
    'src/**/*.graphql',
  ],
  generates: {
  
  },
};

export default config;
