import { Hono } from "hono";
import type { Response } from "./types";
import { StatusCodes } from "@/features/http";

export default new Hono().route("/", (c) => {
	let response: Response.Response;
	let statusCode: StatusCodes;

	const user = c.req("user");

	response = {
		code: "USER_PROFILE",
		data: user,
	};
	statusCode = StatusCodes.OK;

	return c.json(response, statusCode);
});
