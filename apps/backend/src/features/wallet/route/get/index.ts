import { Hono } from "hono";
import type { Response } from "./types";
import { StatusCodes } from "@/features/http";
import AuthMiddleware from "@/features/auth/middleware";
import { Container } from "@n8n/di";
import GetWalletUseCase from "./use-case";

const GetWalletRoute = new Hono().get(
	"/",
	AuthMiddleware.middleware,
	async (c) => {
		let response: Response.Response;
		let statusCode: StatusCodes;

		const user = c.get("user");

		const useCase = Container.get(GetWalletUseCase);
		const result = await useCase.execute(user);

		if (result.isErr) {
			response = result.error;
			statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
		} else {
			response = result.value;
			statusCode = StatusCodes.OK;
		}

		return c.json(response, statusCode);
	},
);

export default GetWalletRoute;
