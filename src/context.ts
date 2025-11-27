import express from "express";
import type { PrismaClient } from "./generated/prisma/client.js";

export interface IAppContext {
    app: express.Express;
    prisma: PrismaClient;
}

export class AppContext {
    private readonly app: express.Express;
    public readonly prisma: PrismaClient;
    
    constructor(app: express.Express, prisma: PrismaClient) {
        this.app = app;
        this.prisma = prisma;
    }
}

export default class AppContextService {
    private static instance: AppContext | undefined;

    public getInstance(app: express.Express, prisma: PrismaClient): AppContext {
        if (AppContextService.instance) {
            return AppContextService.instance;
        }

        AppContextService.instance = new AppContext(app, prisma);
        return AppContextService.instance;
    }
}
