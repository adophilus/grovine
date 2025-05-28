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
			case "ERR_EMAIL_ALREADY_IN_USE": {
				response = {
					code: "ERR_EMAIL_ALREADY_IN_USE",
				};
				return c.json(response, StatusCodes.CONFLICT);
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
	};

	return c.json(response);
});
