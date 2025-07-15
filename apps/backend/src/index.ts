import { globalLogger } from "./features/logger";

export const appLogger = globalLogger.getSubLogger({ name: "AppLogger" });

export { createApp, type App } from "./app";
export { bootstrap } from "./bootstrap";
export { config } from "./features/config";
