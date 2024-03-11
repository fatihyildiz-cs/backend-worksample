import { NextFunction, Request, Response } from "express";
import { errorHandler } from '../exceptions/error-handler';
import { NotFoundError } from "../exceptions/app-error";
import { logger } from "../../utils/logger";

export const logError = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error encountered during request processing: ${err.message}`, {
    error: {
      message: err.message,
      stack: err.stack,
    },
    request: {
      url: req.url,
      method: req.method,
      body: req.body,
    }
  });
  next(err);
};

export const handleError = (err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler.handleError(err, res);
};

// This is not technically an error handler but it felt right to put it here.
export const handleUnknownRoute = (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(`Path ${req.originalUrl} does not exist for ${req.method} method.`));
}