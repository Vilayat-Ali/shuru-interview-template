import type { Request, Response, NextFunction } from 'express';

export const requestStartMiddleware = (req: Request, res: Response, next: NextFunction) => {
    req.startTime = Date.now();
    next();
};

export const requestEndMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const endTime = Date.now();
    const duration = endTime - (req.startTime || endTime);
    console.log(`Request ${req.method} ${req.url} took ${duration} ms`);
    next();
};
