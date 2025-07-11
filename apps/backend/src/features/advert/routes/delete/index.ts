import { Hono } from "hono";
import service from "./service";
import type { Response } from "./types";
import { StatusCodes } from "@/features/http";

export default new Hono().delete("/:id", async (c) => {
	const id = c.req.param("id");
	const result = await service(id);
	let response: Response.Response;
	let statusCode: StatusCodes;

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
