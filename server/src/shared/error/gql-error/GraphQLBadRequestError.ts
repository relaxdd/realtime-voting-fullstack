import { GraphQLError } from 'graphql/index';
import { StatusCodes } from 'http-status-codes';

class GraphQLBadRequestError extends GraphQLError {
  public constructor(message: string) {
    super(
      message, {
        extensions: {
          code: 'BAD_REQUEST',
          http: { status: StatusCodes.BAD_REQUEST },
        },
      },
    );
  }
}

export default GraphQLBadRequestError;