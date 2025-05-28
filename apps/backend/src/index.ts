import { globalLogger } from "./features/logger";

export const appLogger = globalLogger.getSubLogger({ name: "AppLogger" });

export { app, type App } from "./app";
export { config } from "./features/config";
