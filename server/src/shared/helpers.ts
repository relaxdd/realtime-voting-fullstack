import { IAuthSignInInput } from '@/generated/graphql';
import { PrismaClient } from '@/generated/prisma';
import JwtService from '@/shared/services/jwt.service';
import Hex from 'crypto-js/enc-hex';
import hmacSHA256 from 'crypto-js/hmac-sha256';
import sha256 from 'crypto-js/sha256';
import { IncomingHttpHeaders } from 'http';
import { camelToSnakeCase } from '@realtime-voting/shared/src/utils/string.utils';

export function extractJwtToken(headers: IncomingHttpHeaders) {
  return headers?.authorization?.split('Bearer ')?.[1] || null;
}

export function checkTelegramData(authData: IAuthSignInInput, token: string): boolean {
  if (!token) return false;
  
  const { hash: checkHash, ...verifyData } = authData;
  const oneWeekInSeconds = 60 * 60 * 24 * 7;
  const nowDate = Math.round((new Date()).getTime() / 1000);
  
  if (nowDate > authData.authDate + oneWeekInSeconds) {
    return false;
  }
  
  const dataCheckArr = Object.entries(verifyData).reduce<string[]>((acc, [key, value]) => {
    if (value) {
      const snakeKey = camelToSnakeCase(key);
      acc.push(snakeKey + '=' + String(value ?? ''));
    }
    
    return acc;
  }, []);
  
  dataCheckArr.sort();
  
  const dataCheckString = dataCheckArr.join('\n');
  const secretKey = sha256(token, { binary: true });
  const hash = Hex.stringify(hmacSHA256(dataCheckString, secretKey));
  
  return checkHash === hash;
}

export async function validateJwtAndUser(prisma: PrismaClient, jwtToken: string | null) {
  if (!jwtToken) return null;
  
  const jwtService = new JwtService('JWT_SECRET_KEY');
  const jwtPayload = jwtService.verify(jwtToken);
  
  if (!jwtPayload) return null;
  
  const user = await prisma.user.findUnique({
    where: { id: jwtPayload.userId },
    select: { id: true },
  });
  
  return user ? user.id : null;
}