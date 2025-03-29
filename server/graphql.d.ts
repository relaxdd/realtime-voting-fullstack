declare module '*.gql' {
  import { DocumentNode } from 'graphql';
  const Schema: DocumentNode;
  export = Schema;
}

declare module '*.graphql' {
  const Query: import('graphql').DocumentNode;
  export default Query;
  export const _queries: Record<string, import('graphql').DocumentNode>;
  export const _fragments: Record<
    string,
    import('graphql').FragmentDefinitionNode
  >;
}