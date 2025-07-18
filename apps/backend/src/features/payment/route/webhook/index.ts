import { Hono } from "hono";
import { StatusCodes } from "@/features/http";
import { Container } from "@n8n/di";
import WebhookUseCase from "./use-case";

const WebhookRoute = new Hono().post("/", async (c) => {
	const payload = c.req.raw;

	const useCase = Container.get(WebhookUseCase);
	const result = await useCase.execute(payload);

	if (result.isErr) {
		return c.json({ code: "NOT_FOUND" }, StatusCodes.NOT_FOUND);
	}

	return c.json({ code: "SUCCESSFUL" }, StatusCodes.OK);
});

export default WebhookRoute;
