import { Hono } from "hono";
import middleware from "./middleware";
import type { Response } from "./types";
import { StatusCodes } from "@/features/http";
import { Container } from "@n8n/di";
import UpdateAdvertUseCase from "./use-case";

export default new Hono().patch("/:id", middleware, async (c) => {
	let response: Response.Response;
	let statusCode: StatusCodes;

	const id = c.req.param("id");
	const payload = c.req.valid("form");

	const useCase = Container.get(UpdateAdvertUseCase);
	const result = await useCase.execute(id, payload);

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
