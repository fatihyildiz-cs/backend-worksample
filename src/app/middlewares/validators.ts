import { NextFunction, Request, Response } from "express"
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { BadRequestError } from "../exceptions/app-error";

export function validateBody(dtoClass: any) {
  return async function (req: Request, res: Response, next: NextFunction) {
    // 'excludeExtraneousValues' is set to true for sanitization
    const instance = plainToInstance(dtoClass, req.body, { excludeExtraneousValues: true })
    const validationErrors = await validate(instance);
    if (validationErrors.length > 0) {
      const errors = validationErrors.map(error => ({
        property: error.property,
        constraints: error.constraints
      }));
      throw new BadRequestError('Invalid data', errors);
    } else {
      next();
    }
  };
}