import { Hono } from "hono";
import { StatusCodes } from "@/features/http";
import service from "./service";
import middleware from "./middleware";
import type { Response } from "./types";

export default new Hono().post("/", middleware, async (c) => {
	const payload = c.req.valid("json");

	const result = await service(payload);

	let response: Response.Response;

	if (result.isErr) {
		switch (result.error) {
			case "ERR_INVALID_OR_EXPIRED_TOKEN": {
				response = {
					code: "ERR_INVALID_OR_EXPIRED_TOKEN",
				};
				return c.json(response, StatusCodes.BAD_REQUEST);
			}
			case "ERR_UNEXPECTED": {
				response = {
					code: "ERR_UNEXPECTED",
				};
				return c.json(response, StatusCodes.INTERNAL_SERVER_ERROR);
			}
		}
	}

	const tokens = result.value;

	response = {
		code: "AUTH_CREDENTIALS",
		data: tokens,
	};

	return c.json(response);
});
