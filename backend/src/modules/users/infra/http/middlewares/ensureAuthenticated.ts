import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authconfig from '@config/auth';
import AppError from '@shared/errors/AppErrors';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw new Error('JWT token is missing.');
  }
  const [, token] = authHeader.split(' ');
  try {
    const decoded = verify(token, authconfig.jwt.secret);

    const { sub } = decoded as TokenPayload;

    request.user = {
      id: sub,
    };
    return next();
  } catch (error) {
    throw new AppError('Invalid JWT token', 401);
  }
}
