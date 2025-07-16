import { Hono } from "hono";
import { StatusCodes } from "@/features/http";
import * as middleware from "./middleware";
import { Container } from "@n8n/di";
import WebhookUseCase from "./use-case";

export default new Hono().post(
	"/",
	middleware.header,
	middleware.body,
	async (c) => {
		const payload = c.req.valid("json");

		const useCase = Container.get(WebhookUseCase);
		const result = await useCase.execute(payload);

		if (result.isErr) {
			return c.json({ code: "NOT_FOUND" }, StatusCodes.NOT_FOUND);
		}

		return c.json({ code: "SUCCESSFUL" }, StatusCodes.OK);
	},
);
