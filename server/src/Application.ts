import { NextFunction } from 'express';
import * as http from 'http';
import express, { Express, Response, Request, ErrorRequestHandler } from 'express';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import cookieParser from 'cookie-parser';
import apiRouter from './modules/api.router';
import { IEnvVariables } from './shared/named/initEnvVariables';
import { expressMiddleware } from '@apollo/server/express4';
import { createApollo } from './apollo';
import ApiError from './shared/error/class/ApiError';
import handlePrismaError from './shared/error/handlePrismaError';
import { ZodError } from 'zod';
import { PrismaClient } from '@prisma/client';

class Application {
  private readonly ENV: IEnvVariables;
  private readonly app: Express;
  private readonly prisma: PrismaClient;
  
  public constructor(ENV: IEnvVariables) {
    this.ENV = ENV;
    this.app = express();
    this.prisma = new PrismaClient({ datasourceUrl: this.ENV?.PGSQL_URL || '' });
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
  
  private trustProxy() {
    this.app.set('trust proxy', true);
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
  
  public async start() {
    const httpServer = http.createServer(this.app);
    const apolloServer = await createApollo(httpServer);
    
    await apolloServer.start();
    
    const gqlMiddleware = expressMiddleware(apolloServer, {
      context: () => ({
        dataSources: {
          prisma: this.prisma,
        },
      }),
    } as any);
    
    /*
     * ==================================
     */
    
    this.trustProxy();
    this.setupCors();
    
    this.app.use(json());
    this.app.use(cookieParser());
    this.app.use(urlencoded({ extended: true }));
    
    this.app.use('/api/rest', apiRouter);
    
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
}

export default Application;
