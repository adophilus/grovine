import Logger from "./interface";

export const createLogger = () => new Logger({ name: "App", type: "pretty" });
