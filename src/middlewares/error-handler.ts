import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';
import { BadRequestError } from '../errors/bad-request-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    console.log(err)
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  console.log(err)
  res.status(400).send({
    errors: [{ message: 'Something went wrong' }]
  });
};
