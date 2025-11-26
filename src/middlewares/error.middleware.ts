import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

const errorMiddleware = (err: Error & { statusCode: number }, req: Request, res: Response, next: NextFunction) => {
    console.error(`API Error while processing request: ${req.requestId}`);

    if (err instanceof ZodError) {
        res.status(400).json({
            error: 'Payload validation error',
            details: err.issues.map(issue => ({
                code: issue.code,
                message: issue.message,
            }))
        });

        return next();
    }
 
    res.status(err.statusCode || 500).json({
        error: err?.message || 'Internal Server Error',
        message: err.message,
    });

    next();
}

export default errorMiddleware;