import { ZodError } from "zod";
import { type IConfigService } from "./config.interface";
import { configSchema, type ValidatedConfig } from "./config.schema";

export class ConfigService implements IConfigService {
    private readonly config: ValidatedConfig;

    constructor(validatedConfig: ValidatedConfig) {
        this.config = validatedConfig;
    }

    public get<K extends keyof ValidatedConfig>(key: K): ValidatedConfig[K] {
        return this.config[key];
    }

    public getOrThrow<K extends keyof ValidatedConfig>(key: K): ValidatedConfig[K] {
        const value = this.config[key];

        if (value === undefined || value === null) {
            throw new Error(`Configuration key "${key}" is missing or undefined.`);
        }

        return value;
    }
    
    public set<K extends keyof ValidatedConfig>(key: K, value: ValidatedConfig[K]): void {
        this.config[key] = value;
    }
}

let configInstance: IConfigService;

export const getConfigService = (): IConfigService => {
    if (configInstance) {
        return configInstance;
    }

    try {
        const config = configSchema.parse(process.env);
        configInstance = new ConfigService(config);
        return configInstance;
    } catch (error) {
        if (error instanceof ZodError) {
            error.issues.forEach(issue => 
                console.warn(`[${issue.code}] => ${issue.path.join(".")}: ${issue.message}`)
            );
        } else {
            console.error("Failed to initialize ConfigService:", error);
        }
        process.exit(1);
    }
};