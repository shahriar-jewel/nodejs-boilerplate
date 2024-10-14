import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { createResponse, ApiResponse } from "../utils/response";

export function validationMiddleware<T>(dtoClass: any): (req: Request, res: Response, next: NextFunction) => void {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Convert request body to an instance of the DTO
            const dtoInstance = plainToInstance(dtoClass, req.body);

            // Validate the DTO instance
            const errors = await validate(dtoInstance);

            if (errors.length > 0) {
                // Collect all the validation messages into an array
                const validationMessages = errors.flatMap(error =>
                    Object.values(error.constraints || {})
                );

                const errorResponse = {
                    status: 400,
                    error: true,
                    message: "Validation failed",
                    data: validationMessages,
                };

                return res.status(400).send(errorResponse as ApiResponse<any>);
            }

            // If validation passes, continue to the next middleware or route handler
            return next();
        } catch (error) {
            // Handle any unexpected errors and pass them to the global error handler
            return next(error);
        }
    };
}

