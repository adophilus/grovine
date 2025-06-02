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
			case "ERR_USER_NOT_FOUND": {
				response = {
					code: "USER_NOT_FOUND"
				}
				return c.json(response, StatusCodes.NOT_FOUND);
			}
			default: {
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
