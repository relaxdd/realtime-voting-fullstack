import { StatusCodes } from 'http-status-codes'
import ApiError from './ApiError'

class InternalServerError extends ApiError {
  constructor(message: string) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR)
  }
}

export default InternalServerError