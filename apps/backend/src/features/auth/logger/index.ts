import { globalLogger } from "@/features/logger";

export const logger = globalLogger.getSubLogger({ name: "AuthLogger" });
