import { type ILogObj, Logger } from "tslog";

export const logger = new Logger<ILogObj>({ name: "App", type: "pretty" });
