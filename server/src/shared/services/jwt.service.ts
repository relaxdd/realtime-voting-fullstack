import { IJwtPayload } from '@/generated/graphql';
import InternalServerError from '@/shared/error/class/InternalServerError';
import { StringValue } from 'ms';
import jwt, { SignOptions } from 'jsonwebtoken';

class JwtService {
  private readonly secret: string;
  
  public constructor(secret: string | undefined | null) {
    this.secret = secret || '';
    
    if (!this.secret) {
      throw new InternalServerError('Не хватает данных в env окружении');
    }
  }
  
  public sign(payload: IJwtPayload, expiresIn: number | StringValue = '1 week') {
    const params: SignOptions = { expiresIn };
    return jwt.sign(payload, this.secret, params);
  }
  
  public decode<P = {}>(token: string): (IJwtPayload & P) | false {
    try {
      return jwt.decode(token) as (IJwtPayload & P);
    } catch (e) {
      return false;
    }
  }
  
  public verify<P = {}>(token: string): (IJwtPayload & P) | false {
    try {
      return jwt.verify(token, this.secret) as (IJwtPayload & P);
    } catch (e) {
      return false;
    }
  }
}

export default JwtService;