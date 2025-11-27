import express, { Express } from "express";
import { UserRoutes } from "./users/route";

export const setupServerRoutes = (version: number, app: Express) => {    
    const apiRouter = express.Router()
    
    // user
    new UserRoutes().setupRoutes("/users", apiRouter);

    app.use(`/api/v${version}`, apiRouter);
}