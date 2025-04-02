import { StatusCodes } from 'http-status-codes';
import ApiError from './api.error';

class NotFoundError extends ApiError {
  constructor(message: string) {
    super(message, StatusCodes.NOT_FOUND);
  }
}

export default NotFoundError;