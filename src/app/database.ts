import mongoose from "mongoose";
import { logger } from "../utils/logger";
import { InternalError } from "./exceptions/app-error";

export default function connectDB() {
  const url = process.env.DATABASE_URL

  try {
    mongoose.connect(url);
  } catch (err) {
    // this is a critical error, so we should exit the process and hope that the process manager will restart the app
    throw new InternalError('Failed to connect to the database.', err);
  }

  const dbConnection = mongoose.connection;

  dbConnection.once("open", () => {
    logger.info(`Successfully connected to the database.`);
  });

  dbConnection.on("error", (err) => {
    throw new InternalError('Received error from the database connection.', err);
  });
}