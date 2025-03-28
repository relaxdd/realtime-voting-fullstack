import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: './src/schema.gql',
  ignoreNoDocuments: true,
  generates: {
    'src/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
    },
    './graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
  config: {
    // useIndexSignature: true,
    contextType: '../apollo#IApolloContext',
    typesPrefix: 'I',
    constEnums: true,
    // enumPrefix: false,
    // skipTypename: false,
    // nonOptionalTypename: true,
    maybeValue: 'T extends PromiseLike<infer U> ? Promise<U | null> : T | null'
  },
}
// maybeValue: "T | null | undefined"
export default config
