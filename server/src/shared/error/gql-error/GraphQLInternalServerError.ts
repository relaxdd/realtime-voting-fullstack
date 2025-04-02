import { GraphQLError } from 'graphql/index';
import { StatusCodes } from 'http-status-codes';

class GraphQLInternalServerError extends GraphQLError {
  public constructor(message: string) {
    super(
      message, {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          http: { status: StatusCodes.INTERNAL_SERVER_ERROR },
        },
      },
    );
  }
}

export default GraphQLInternalServerError;