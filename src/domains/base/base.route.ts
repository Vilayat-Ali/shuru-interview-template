import express from 'express';

type HttpMethod = 'get' | 'post' | 'put' | 'delete';
type Middleware = express.RequestHandler | express.RequestHandler[];
type Controller = (request: express.Request, response: express.Response, next: express.NextFunction) => Promise<unknown> | unknown;

export interface IBaseRoute {
    registerRoute(path: string, httpMethod: HttpMethod, controllerFn: Controller, middlewareFn?: Middleware): void;
    setupRoutes(baseRoutePath: string, parentRouter: express.Router): void;
    setupRouteLevelMiddleware(middlewareFn: Middleware): void;
}

export abstract class BaseRoute implements IBaseRoute {
    private readonly router: express.Router;

    constructor () {
        this.router = express.Router();
        this.registerRoute = this.registerRoute.bind(this);
        this.setupRouteLevelMiddleware = this.setupRouteLevelMiddleware.bind(this);    }

    setupRoutes(baseRoutePath: string, parentRouter: express.Router) {
        parentRouter.use(baseRoutePath, this.router);
    }

    setupRouteLevelMiddleware(middlewareFn: Middleware): void {
        this.router.use(middlewareFn);
    }

    registerRoute(path: string, httpMethod: HttpMethod, controllerFn: Controller, middlewareFn?: Middleware): void {
        const middlewares = middlewareFn ? (Array.isArray(middlewareFn) ? middlewareFn : [middlewareFn]) : [];
        
        this.router[httpMethod](path, ...middlewares, this.layerErrorHandlingControllerFn(controllerFn));
    }

    private layerErrorHandlingControllerFn(controllerFn: Controller): express.RequestHandler {
        return async (request: express.Request, response: express.Response, next: express.NextFunction) => {
            try {
                await controllerFn(request, response, next);
            } catch (error) {
                next(error);
            } finally {
                next();
            }
        }
    }
}