import { PrismaClientKnownRequestError } from '@/generated/prisma/runtime/library'
import ApiError from '@/shared/error/api-error/api.error'
import InternalServerError from '@/shared/error/api-error/internal-server.error'
import BadRequestError from '@/shared/error/api-error/bad-request.error'
import NotFoundError from '@/shared/error/api-error/not-found.error'

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
