import type { Request, Response } from "./types";
import Repository from "../../repository";
import { Result } from "true-myth";

export default async function service(
	payload: Request.Body,
	user_id: string,
): Promise<Result<Response.Success, Response.Error>> {
	const { id, quantity } = payload;

	const addItemToCartResult = await Repository.addItemToCart({
		userId: user_id,
		itemId: id,
		quantity,
	});

	if (addItemToCartResult.isErr) {
		if (addItemToCartResult.error === "ERR_ITEM_NOT_FOUND") {
			return Result.err({ code: "ERR_ITEM_NOT_FOUND" });
		}

		return Result.err({ code: "ERR_UNEXPECTED" });
	}

	return Result.ok({ code: "ITEM_ADDED_TO_CART" });
}
