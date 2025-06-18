// src/authHandler.ts
import { APIError, Gateway, Header } from 'encore.dev/api';
import { authHandler } from 'encore.dev/auth';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = 'jwt_secret';

interface AuthParams {
  authorization: Header<'Authorization'>;
}

export interface AuthData {
  userID: string;
  emailAddress: string | null;
}



const myAuthHandler = authHandler(
  async (params: AuthParams): Promise<AuthData> => {
    const token = params.authorization?.replace('Bearer ', '');

    if (!token) {
      throw APIError.unauthenticated('no token provided');
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

      if (!decoded.sub || !decoded.email) {
        throw APIError.unauthenticated('invalid token payload');
      }

      // console.log('decoded', decoded)

      return {
        userID: decoded.sub,
        emailAddress: decoded.email,
      };
    } catch (e) {
      throw APIError.unauthenticated('invalid token', e as Error);
    }
  },
);

export const mygw = new Gateway({ authHandler: myAuthHandler });
