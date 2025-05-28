import { Hono } from "hono";
import middleware from "./middleware";
import service from "./service";
import { StatusCodes } from "../../../http";
import type { paths } from "@grovine/api/types";

export type Response =
	paths["/api/auth/sign-in"]["post"]["responses"][keyof paths["/api/auth/sign-in"]["post"]["responses"]]["content"]["application/json"];

export default new Hono().post("/sign-in", middleware, async (c) => {
	const payload = c.req.valid("json");

	const result = await service(payload);

	let response: Response;

	if (result.isErr) {
		response = {
			code: "ERR_UNEXPECTED",
		};
		return c.json(response, StatusCodes.UNAUTHORIZED);
	}

	response = {
		code: "VERIFICATION_EMAIL_SENT",
	};

	return c.json(response);
});
