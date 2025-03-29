
import { Router } from 'express'
import votingRouter from './voting/voting.router'
import NotFoundError from '@/shared/error/class/NotFoundError'

const apiRouter = Router()

apiRouter.use('/voting', votingRouter)

apiRouter.all('/*', (req, res, next) => {
  return next(new NotFoundError('Неверный адрес api запроса'))
})

export default apiRouter
