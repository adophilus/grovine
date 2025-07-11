import { Hono } from "hono";
import middleware from "./middleware";
import type { Response } from "./types";
import service from "./service";
import { StatusCodes } from "@/features/http";

export default new Hono().patch("/:id", middleware, async (c) => {
	let response: Response.Response;
	let statusCode: StatusCodes;

	const id = c.req.param("id");
	const payload = c.req.valid("form");

	const result = await service(id, payload);

	if (result.isErr) {
		switch (result.error.code) {
			case "ERR_ADVERTISEMENT_NOT_FOUND": {
				response = result.error;
				statusCode = StatusCodes.NOT_FOUND;
				break;
			}
			default: {
				response = result.error;
				statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
				break;
			}
		}
	} else {
		response = result.value;
		statusCode = StatusCodes.OK;
	}

	return c.json(response, statusCode);
});
