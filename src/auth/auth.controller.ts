import { api } from 'encore.dev/api';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = 'jwt_secret';

export const generateToken = api(
  {
    method: 'POST',
    path: '/auth/login',
    expose: true,
  },
  async (): Promise<{ token: string }> => {

    const payload: JwtPayload = {
      sub: 'user-jack',
      email: 'jack@example.com',
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '1h',
    });

    console.log('token', token);

    return { token };
  },
);
