import { PrismaClient } from '@/generated/prisma';
import VotingRouter from '@/modules/voting/voting.router';
import { extractJwtToken, validateJwtAndUser } from '@/shared/helpers';
import { Router } from 'express';
import NotFoundError from '@/shared/error/api-error/not-found.error';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import { NextFunction, Request, Response } from 'express';

type RequestExtraContext = {
  userId?: string | null
}

export type RequestWithUser<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query,
  Locals extends Record<string, any> = Record<string, any>
> = Request<P, ResBody, ReqBody, ReqQuery, Locals> & { extraContext?: RequestExtraContext }

class ApiRouter {
  public readonly router: Router;
  public readonly prisma: PrismaClient;
  
  public checkAuthorization() {
    return async (req: RequestWithUser, _: Response, next: NextFunction) => {
      try {
        const jwt = extractJwtToken(req.headers);
        if (!jwt) return next();
        
        const userId = await validateJwtAndUser(this.prisma, jwt);
        if (!userId) return next();
        
        if (!('extraContext' in req)) req['extraContext'] = { userId };
        else req['extraContext']['userId'] = userId;
        
        return next();
      } catch (err) {
        return next(err);
      }
    };
  }
  
  public constructor(prisma: PrismaClient, { votingRouter }: { votingRouter: VotingRouter }) {
    this.prisma = prisma;
    this.router = Router();
    
    this.router.use(this.checkAuthorization());
    this.router.use('/voting', votingRouter.router);
    
    this.router.all('/*', (_, __, next) => {
      return next(new NotFoundError('Неверный адрес api запроса'));
    });
  }
}

export default ApiRouter;