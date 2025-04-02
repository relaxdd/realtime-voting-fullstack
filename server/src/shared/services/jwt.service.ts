import { IJwtPayload } from '@/generated/graphql';
import InternalServerError from '@/shared/error/api-error/internal-server.error';
import { StringValue } from 'ms';
import jwt, { SignOptions } from 'jsonwebtoken';
import process from 'node:process';

class JwtService {
  private readonly secret: string;
  
  public constructor(secretKey: string) {
    const secret = process?.env?.[secretKey] || null;
    if (!secret) throw new InternalServerError('Не хватает данных в env окружении');
    this.secret = secret;
  }
  
  public sign(payload: IJwtPayload, expiresIn: number | StringValue = '1 week') {
    const params: SignOptions = { expiresIn };
    return jwt.sign(payload, this.secret, params);
  }
  
  public verify<P = {}>(token: string): (IJwtPayload & P) | null {
    try {
      return jwt.verify(token, this.secret) as (IJwtPayload & P);
    } catch (e) {
      return null;
    }
  }
  
  public decode<P = {}>(token: string): (IJwtPayload & P) | null {
    try {
      return jwt.decode(token) as (IJwtPayload & P);
    } catch (e) {
      return null;
    }
  }
}

export default JwtService;