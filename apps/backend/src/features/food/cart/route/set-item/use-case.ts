import type { Request, Response } from "./types";
import { Result } from "true-myth";
import type FoodCartRepository from "../../repository/interface";
import type { User } from "@/types";

class CartSetItemUseCase {
	constructor(private cartRepository: FoodCartRepository) {}

	public async execute(
		payload: Request.Body,
		user: User.Selectable,
	): Promise<Result<Response.Success, Response.Error>> {
		const { id, quantity } = payload;

		const addItemToCartResult = await this.cartRepository.addItem({
			userId: user.id,
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
}

export default CartSetItemUseCase;
