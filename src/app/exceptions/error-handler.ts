import { Response } from 'express';
import { AppError, StatusCode } from './app-error';
import { logger } from '../../utils/logger';

class ErrorHandler {
  public handleError(error: Error | AppError, response?: Response): void {
    if (this.isTrustedError(error)) {
      this.handleTrustedError(error as AppError, response);
      return
    }
    this.handleUntrustedError(error, response);
  }

  private isTrustedError(error: Error): boolean {
    if (error instanceof AppError) {
      return error.isOperational;
    }
    return false
  }

  /*
    Whether it is a trusted or untrusted error, we should not send the error trace to the client as it poses a big security risk.
    For development environment however, it is probably a good idea to do it.
  */
  private handleTrustedError(error: AppError, response: Response): void {
    response.status(error.statusCode).json({ message: error.message, context: error.context });
  }

  private handleUntrustedError(error: Error | AppError, response?: Response): void {
    if (response) {
      // if the error is coming from a request&response cycle, let's send a generic error response before shutting down the app
      response.status(StatusCode.InternalError).json({ message: 'Internal server error' });
    }
    logger.error('Application encountered an untrusted error. Exiting the app.', { error });
    /*
      it is a best practice to exit the process when the application encounters an untrusted error as it might be
      in an unreliable state. ideally, we would set up a mechanism (using pm2, docker etc) to restart the application in such cases
    */
    process.exit(1);
  }
}

export const errorHandler = new ErrorHandler();
