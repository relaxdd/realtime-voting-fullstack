import { GraphQLError } from 'graphql/index';
import { StatusCodes } from 'http-status-codes';

class GraphQLForbiddenError extends GraphQLError {
  public constructor(message: string) {
    super(
      message, {
        extensions: {
          code: 'FORBIDDEN',
          http: { status: StatusCodes.FORBIDDEN },
        },
      },
    );
  }
}

export default GraphQLForbiddenError;