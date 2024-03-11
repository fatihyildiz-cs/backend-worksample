import "reflect-metadata";
import 'express-async-errors'; // need to import to handle async errors
import './exceptions/process';
import express, { Express } from 'express';
import * as dotenv from 'dotenv';
import { handleError, handleUnknownRoute, logError } from './middlewares/errors';
import { routes } from "./routes";
import bodyParserErrorHandler from 'express-body-parser-error-handler'

/*
  I chose to inject the database connection method to decouple the db from the app. This way we can connect 
  to the actual database when we're running the server or pass in a mock database connection method when running tests. 
  Likewise for swagger.
*/
export default function (connectDb: () => void, setupSwagger: (app: Express) => void) {
  dotenv.config();
  connectDb();
  const app: Express = express();
  // I would actually choose to setup swagger in server.ts but we need to set it up before the unknown route handler.
  setupSwagger(app);
  app.use(express.json())
  app.use(bodyParserErrorHandler());
  // I chose to bind the specific routes in a separate file to keep the app/index.ts file clean.
  app.use('/', routes);
  // It is a good idea to have a catch-all route handler to handle unknown routes
  app.all("*", handleUnknownRoute);
  app.use(logError);
  app.use(handleError);

  return app
}