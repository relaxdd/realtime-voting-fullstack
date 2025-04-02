import VotingRouter from '@/modules/voting/voting.router';
import { extractJwtToken, validateJwtAndUser } from '@/shared/helpers';
import * as http from 'http';
import express, { Express, Response, Request, NextFunction, ErrorRequestHandler } from 'express';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import cookieParser from 'cookie-parser';
import { ZodError } from 'zod';
import ApiRouter from '@/modules/api.router';
import { createApollo, IApolloContext } from '@/apollo';
import { expressMiddleware } from '@apollo/server/express4';
import { IEnvVariables } from '@/shared/named/initEnvVariables';
import handlePrismaError from '@/shared/error/handle-prisma.error';
import ApiError from '@/shared/error/api-error/api.error';
import { PrismaClient } from '@/generated/prisma';

class Application {
  private readonly ENV: IEnvVariables;
  private readonly app: Express;
  private readonly prisma: PrismaClient;
  
  public constructor(ENV: IEnvVariables) {
    this.ENV = ENV;
    this.app = express();
    this.prisma = new PrismaClient({ datasourceUrl: this.ENV?.PGSQL_URL || '' });
  }
  
  public async start() {
    const httpServer = http.createServer(this.app);
    
    const apolloServer = await createApollo(httpServer);
    await apolloServer.start();
    
    const votingRouter = new VotingRouter();
    const apiRouter = new ApiRouter(this.prisma, { votingRouter });
    
    /*
     * ==================================
     */
    
    const gqlMiddleware = expressMiddleware(apolloServer, {
      context: async ({ req }: { req: Request, res: Response }): Promise<IApolloContext> => {
        const jwt = extractJwtToken(req.headers);
        const currentUser = await validateJwtAndUser(this.prisma, jwt);
        
        return {
          currentUser,
          providers: { prisma: this.prisma },
          controllers: { voting: votingRouter.controller },
        };
      },
    } as any);
    
    /*
     * ==================================
     */
    
    this.trustProxy();
    this.setupCors();
    
    this.app.use(json());
    this.app.use(cookieParser());
    this.app.use(urlencoded({ extended: true }));
    
    this.app.use('/api/rest', apiRouter.router);
    
    this.app.use(gqlMiddleware as any);
    this.app.use(this.errorsHandler());
    
    /*
     * ==================================
     */
    
    if (!this.ENV.EXPOSE) {
      httpServer.listen(this.ENV.PORT, () => {
        console.log(`[Express]: Server is running at http://localhost:${this.ENV.PORT}`);
      });
    } else {
      httpServer.listen(this.ENV.PORT, '0.0.0.0', () => {
        import('address').then(({ ip }) => {
          console.log(`[Express]: Server is running at http://${ip()}:${this.ENV.PORT}`);
        });
      });
    }
  }
  
  /*
   * ================================
   */
  
  private trustProxy() {
    this.app.set('trust proxy', true);
  }
  
  private setupCors() {
    if (this.ENV.IS_DEV) {
      this.app.use(
        cors({
          origin: '*',
          methods: ['GET', 'POST', 'OPTIONS'],
          // exposedHeaders: Application.exposeHeaders,
        }),
      );
    } else if (this.ENV.ALLOW_ORIGIN) {
      this.app.use(
        cors({
          origin: this.ENV.ALLOW_ORIGIN,
          methods: ['GET', 'POST', 'OPTIONS'],
          // exposedHeaders: Application.exposeHeaders,
        }),
      );
    }
  }
  
  private errorsHandler(): ErrorRequestHandler {
    const IS_PROD = this.ENV.IS_PROD;
    
    return function (err: Error, req: Request, res: Response, _: NextFunction) {
      if (!err) {
        res.status(500).json({ message: 'Unexpected server behavior' });
      }
      
      function handleProdError(err: Error, status: number) {
        console.log(err);
        const msg = 'An error occurred during the execution of the request, please try again later';
        return new ApiError(msg, status);
      }
      
      function parseZodError(error: ZodError) {
        return error.errors.map((issue: any) => ({
          issue: issue.path.join('.'),
          message: `${issue.path.join('.')} is ${issue.message}`,
        }));
      }
      
      function handleUnknownError(err: Error) {
        return ApiError.from(err, 500, 'Unexpected InternalServerError', {}, true);
      }
      
      const status = err instanceof ApiError ? err.code : 500;
      
      const apiError = ((err: Error): ApiError => {
        if (IS_PROD && status >= 500) return handleProdError(err, status);
        else if (err instanceof ApiError) return err;
        else if (err instanceof ZodError) return new ApiError('ZodValidationError', status, parseZodError(err));
        else if (err.name.startsWith('Prisma')) return handlePrismaError(err);
        else return handleUnknownError(err);
      })(err);
      
      res.status(status).json(apiError.toObject());
    };
  }
}

export default Application;
