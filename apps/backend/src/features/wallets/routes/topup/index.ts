import { Hono } from "hono";
import middleware from "./middleware";
import service from "./service";
import { StatusCodes } from "@/features/http";
import { AuthMiddleware } from "@/features/auth";
import type { Response } from "./types";

export default new Hono().post(
	"/",
	AuthMiddleware.middleware,
	middleware,
	async (c) => {
		let response: Response.Response;
		let statusCode: StatusCodes;

		const payload = c.req.valid("json");
		const user = c.get("user");

		const result = await service(payload, user);

		if (result.isErr) {
			response = result.error;
			statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
		} else {
			response = result.value;
			statusCode = StatusCodes.OK;
		}

		return c.json(response, statusCode);
	},
);
