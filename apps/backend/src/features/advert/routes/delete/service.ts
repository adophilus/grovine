import Repository from "../../repository";
import type { Response } from "./types";
import { Result } from "true-myth";

export default async (
	id: string,
): Promise<Result<Response.Success, Response.Error>> => {
	const findAdvertResult = await Repository.findAdvertById(id);

	if (findAdvertResult.isErr) {
		return Result.err({ code: "ERR_UNEXPECTED" });
	}

	if (!findAdvertResult.value) {
		return Result.err({ code: "ERR_ADVERTISEMENT_NOT_FOUND" });
	}

	const result = await Repository.deleteAdvertById(id);

	if (result.isErr) {
		return Result.err({ code: "ERR_UNEXPECTED" });
	}

	return Result.ok({ code: "ADVERTISEMENT_DELETED" });
};
