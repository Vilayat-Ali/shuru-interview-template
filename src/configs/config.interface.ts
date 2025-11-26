import { type ValidatedConfig } from "./config.schema.js";

export interface IConfigService {
    get<K extends keyof ValidatedConfig>(key: K): ValidatedConfig[K];
    getOrThrow<K extends keyof ValidatedConfig>(key: K): ValidatedConfig[K];
    set<K extends keyof ValidatedConfig>(key: K, value: ValidatedConfig[K]): void;
}