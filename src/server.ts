import express from "express";
import { defaultMiddlewares } from "./middlewares";
import { initializePrismaClient } from "./database/db.util";
import errorMiddleware from "./middlewares/error.middleware";
import { requestEndMiddleware } from "./middlewares/requestBenmark.middleware";
import { getConfigService } from "./configs/config.service";
import AppContextService from "./context";
import {setupServerRoutes} from './domains/routes';

export const bootstrapServer = async () => {
    try {
        const configService = getConfigService();
        
        const app = express();

        defaultMiddlewares.forEach(middleware => app.use(middleware));
        
        const prismaClient = initializePrismaClient(
            configService.getOrThrow("NODE_ENV"),
            configService.getOrThrow("databaseUrl")
        );

        const contextService = new AppContextService().getInstance(app, prismaClient);

        app.get("/health", async (_req, res, next) => {
            try {
                const count = await contextService.prisma.user.count();

                return res.status(200).json({ status: "OK", userCount: count });
            } catch (error) {
                console.log(error)
                next(error);
            }
        });

        setupServerRoutes(1, app);

        app.use(errorMiddleware);
        app.use(requestEndMiddleware);

        const serverPort = configService.get("port");

        app.listen(configService.get('port'), () => {
            console.log(`Server is running on port ${serverPort} in ${configService.get('NODE_ENV')} mode.`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}