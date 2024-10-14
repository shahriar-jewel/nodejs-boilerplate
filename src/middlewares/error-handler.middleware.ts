import { Request, Response, NextFunction } from "express";
import { createResponse } from "../utils/response";

// global error handler
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    const status = err.status || 500;
    const message = err.message || "Internal server error";

    return res.status(status).send(createResponse(status, message));
}

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
    const response: { status: number; error: boolean; message: string; data: null } = {
        status: 404,
        error: true,
        message: "Endpoint not found",
        data: null,
    };
    return res.status(404).send(response);
}
