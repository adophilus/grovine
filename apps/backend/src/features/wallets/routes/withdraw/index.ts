import { Hono } from "hono";
import middleware from "./middleware";
import type { Response } from "./types";
import service from "./service";
import { StatusCodes } from "@/features/http";

export default new Hono().post("/", middleware, async (c) => {
	let response: Response.Response;
	let statusCode: StatusCodes;

	const payload = c.req.valid("json");

	const result = await service(payload);

	if (result.isErr) {
	  response = result.error
	  switch (result.error.code) {
	    case "ERR_INSUFFICIENT_FUNDS": {
	      statusCode = StatusCodes.BAD_REQUEST
	      break
	    }
	    default: {
	      statusCode = StatusCodes.INTERNAL_SERVER_ERROR
	    }
	  }
	}
	else {
	  response = result.value
	  statusCode = StatusCodes.OK
	}

	return c.json(response, statusCode);
});

