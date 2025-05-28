import { Hono } from "hono";
import { authRouter } from "./features/auth";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { logger as honoLogger } from "hono/logger";
import { Logger } from "./features/logger";
import { StatusCodes } from "./features/http";

const apiRoutes = new Hono().route("/auth", authRouter);

export const logger = Logger.getSubLogger({ name: "ServerLogger" });

export const app = new Hono()
	.use(compress())
	.use(cors())
	.use(honoLogger())
	.route("/", apiRoutes)
	.notFound((c) => c.json({ error: "NOT_FOUND" }, StatusCodes.NOT_FOUND));

export type App = typeof app;
