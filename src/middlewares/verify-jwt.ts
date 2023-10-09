import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { BadRequestError } from '../errors/bad-request-error';

export const verifyJWT = (
    req: any,
    res: Response,
    next: NextFunction
) => {
    const authHeader: any = req.headers.authorization || req.headers.Authorization;

    const secret: any = process.env.ACCESS_TOKEN_SECRET_KEY
    if (!authHeader?.startsWith('Bearer ')) {
        throw new NotAuthorizedError()
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        secret,
        (err: any, decoded: any) => {
            if (err) {
                throw new BadRequestError('token as expired')
            }
            req.user = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;
            next();
        }
    );
}