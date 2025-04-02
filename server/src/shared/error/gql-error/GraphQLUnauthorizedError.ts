import { GraphQLError } from 'graphql/index';
import { StatusCodes } from 'http-status-codes';

class GraphQLUnauthorizedError extends GraphQLError {
  public constructor(message: string) {
    super(message, {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: StatusCodes.UNAUTHORIZED },
      },
    });
  }
}

export default GraphQLUnauthorizedError;