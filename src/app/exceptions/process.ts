import { logger } from "../../utils/logger";
import { errorHandler } from "./error-handler";

process.on('unhandledRejection', (reason: Error | any) => {
  logger.error(`Unhandled Rejection: ${reason.message || reason}`);
  // Throw an error so that the rejection is in a format that we can send to our error handler.
  throw new Error(reason.message || reason);
});

process.on('uncaughtException', (error: Error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  errorHandler.handleError(error);
});