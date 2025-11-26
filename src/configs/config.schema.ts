import { z } from "zod";

const nodeEnvEnum = z.enum(["development", "production", "test"]);

export const configSchema = z.object({
    NODE_ENV: nodeEnvEnum.default("development"),
    PORT: z.string().min(4, {
        message: "Port must be at least 4 characters long"
    }).max(4, {
        message: "Port must be at most 4 characters long"
    }).default("8080").transform((port: string) => Number(port)),
    DATABASE_URL: z.url().min(1, {
        message: "Database URL is required"
    }),
    ACCESS_TOKEN_SECRET: z.string().min(1, {
        message: "Access token secret is required"
    }),
    REFRESH_TOKEN_SECRET: z.string().min(1, {
        message: "Refresh token secret is required"
    }),
}).transform((config) => ({
    NODE_ENV: config.NODE_ENV,
    port: config.PORT,
    databaseUrl: config.DATABASE_URL,
    accessTokenSecret: config.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: config.REFRESH_TOKEN_SECRET,
}));

export type NodeEnv = z.infer<typeof nodeEnvEnum>;
export type ValidatedConfig = z.infer<typeof configSchema>;