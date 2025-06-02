import { Hono } from "hono";
import { StatusCodes } from "@/features/http";
import service from "./service";
import middleware from "./middleware";
import type { Response } from "./types";

export default new Hono().post("/", middleware, async (c) => {
	let response: Response.Response;
	let statusCode: StatusCodes;

	const payload = c.req.valid("json");

	const result = await service(payload);

	if (result.isErr) {
		switch (result.error.code) {
			case "ERR_INVALID_OR_EXPIRED_OTP": {
				response = result.error;
				statusCode = StatusCodes.BAD_REQUEST;
				break;
			}
			default: {
				response = result.error;
				statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
			}
		}
	} else {
		response = result.value;
		statusCode = StatusCodes.OK;
	}

	return c.json(response, statusCode);
});
