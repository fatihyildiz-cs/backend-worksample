import { Router } from "express";
import { apiRouter } from "./api";

export const routes = Router()

/*
  This type of structure for routes is an overkill for this application, but it would be very useful 
  in more complex apps where we want to separate interfaces with route prefixes.
*/
routes.use('/api', apiRouter)