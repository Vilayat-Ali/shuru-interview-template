import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'
import type { NodeEnv } from "../configs/config.schema";

export const initializePrismaClient = (env: NodeEnv, databaseUrl: string): PrismaClient => {    
    const sqliteAdapter = new PrismaPg({
        connectionString: databaseUrl,
    });

    return new PrismaClient({
        adapter: sqliteAdapter,
        log: env === "development" ? [
            { emit: "event", level: "query" },
            { emit: "event", level: "info" },
            { emit: "event", level: "warn" },
            { emit: "event", level: "error" },
        ] : [
            { emit: "event", level: "warn" },
            { emit: "event", level: "error" },
        ],
    })
}