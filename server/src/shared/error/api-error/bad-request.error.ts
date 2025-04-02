import { StatusCodes } from 'http-status-codes';
import ApiError from './api.error';

class BadRequestError extends ApiError {
  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST);
  }
}

export default BadRequestError;