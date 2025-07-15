import { Hono } from "hono";
import type { Response } from "./types";
import { StatusCodes } from "@/features/http";
import { Container } from "@n8n/di";
import DeleteAdvertUseCase from "./use-case";

export const DeleteAdvertRoute = new Hono().delete("/:id", async (c) => {
	let response: Response.Response;
	let statusCode: StatusCodes;

	const id = c.req.param("id");

	const useCase = Container.get(DeleteAdvertUseCase);
	const result = await useCase.execute(id);

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
