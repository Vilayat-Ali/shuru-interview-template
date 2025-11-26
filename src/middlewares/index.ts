import express from "express";
import helmet from "helmet";
import * as cors from "cors";

import requestIdMiddleware from "./requestId.middleware";
import { requestStartMiddleware } from "./requestBenmark.middleware";

export const defaultMiddlewares =  [
    requestStartMiddleware,
    helmet(),
    cors.default({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
    requestIdMiddleware,
    express.json(),
];