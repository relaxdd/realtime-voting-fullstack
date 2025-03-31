import { PrismaClientKnownRequestError } from '@/generated/prisma/runtime/library'
import ApiError from './class/ApiError'
import InternalServerError from './class/InternalServerError'
import BadRequestError from './class/BadRequestError'
import NotFoundError from './class/NotFoundError'

function handlePrismaError(err: Error) {
  if (err.name === 'PrismaClientInitializationError') {
    return new InternalServerError('Failed to connect to the database, check if it is available')
  }

  if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2000':
        return new BadRequestError(`Duplicate field value: ${err?.meta?.['target']}`)
      case 'P2002':
        return new BadRequestError(`Duplicate field value: ${err?.meta?.['target']}`)
      case 'P2003':
        return new BadRequestError(`Invalid input data: ${err?.meta?.['target']}`)
      case 'P2014':
        return new BadRequestError(`Invalid ID: ${err?.meta?.['target']}`)
      case 'P2025':
        return new NotFoundError(`Record with same ID not found`)
      default:
        return new InternalServerError(`Something went wrong: ${err?.message}`)
    }
  }

  return ApiError.from(err, 500, 'Unknown PrismaClientError', {}, true)
}

export default handlePrismaError
