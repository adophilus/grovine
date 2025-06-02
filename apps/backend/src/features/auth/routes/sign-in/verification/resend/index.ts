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
			case "ERR_TOKEN_NOT_EXPIRED": {
				response = {
					code: "ERR_TOKEN_NOT_EXPIRED",
				};
				return c.json(response, StatusCodes.CONFLICT);
			}
			case "ERR_USER_ALREADY_VERIFIED": {
				response = {};
				return c.json(response, StatusCodes.BAD_REQUEST);
			}
			case "ERR_USER_NOT_FOUND": {
				response = {};
				return c.json(response, StatusCodes.NOT_FOUND);
			}
			case "ERR_VERIFICATION_EMAIL_ALREADY_SENT": {
				response = {};
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

	response = {
		code: "VERIFICATION_EMAIL_SENT",
		data: result.value,
	};

	return c.json(response);
});
