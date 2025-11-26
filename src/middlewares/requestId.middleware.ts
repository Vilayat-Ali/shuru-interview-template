import type { Request, Response, NextFunction } from 'express';
import { v6 as uuidv6 } from 'uuid';

const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {    
    const requestId = req.headers['x-request-id'] || uuidv6();
    req.headers['x-request-id'] = requestId;
    res.setHeader('X-Request-Id', requestId);
    next();
}

export default requestIdMiddleware;