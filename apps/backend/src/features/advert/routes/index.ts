import { Hono } from "hono";
import createRouter from "./create";
import listRouter from "./list";
import updateRouter from "./update";
import deleteRouter from "./delete";

export default new Hono()
	.route("/", createRouter)
	.route("/", listRouter)
	.route("/", updateRouter)
	.route("/", deleteRouter);
