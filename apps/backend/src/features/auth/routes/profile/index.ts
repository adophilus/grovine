import { Hono } from "hono";
import type { Response } from "./types";
import { StatusCodes } from "@/features/http";
import AuthMiddleware from "../../middleware";

export default new Hono().get("/", AuthMiddleware.middleware, (c) => {
	let response: Response.Response;
	let statusCode: StatusCodes;

	const user = c.get("user");

	response = {
		code: "USER_PROFILE",
		data: user,
	};
	statusCode = StatusCodes.OK;

	return c.json(response, statusCode);
});
