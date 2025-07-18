import type { FoodItem } from "@/types";
import { Result, Unit } from "true-myth";
import type { Pagination } from "@/features/pagination";
import type FoodItemRepository from "./interface";
import type { KyselyClient } from "@/features/database/kysely";
import type { Logger } from "@/features/logger";
import type { FoodItemRepositoryError } from "./interface";

class FoodItemKyselyRepository implements FoodItemRepository {
	constructor(
		private client: KyselyClient,
		private logger: Logger,
	) {}

	public async create(
		payload: FoodItem.Insertable,
	): Promise<Result<FoodItem.Selectable, FoodItemRepositoryError>> {
		try {
			const item = await this.client
				.insertInto("food_items")
				.values(payload)
				.returningAll()
				.executeTakeFirstOrThrow();
			return Result.ok(item);
		} catch (err) {
			this.logger.error("failed to create item:", err);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async list(
		payload: Pagination.Options,
	): Promise<Result<FoodItem.Selectable[], FoodItemRepositoryError>> {
		try {
			const items = await this.client
				.selectFrom("food_items")
				.selectAll()
				.limit(payload.per_page)
				.offset(payload.page)
				.execute();

			return Result.ok(items);
		} catch (err) {
			this.logger.error("failed to list items:", err);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async findById(
		id: string,
	): Promise<Result<FoodItem.Selectable | null, FoodItemRepositoryError>> {
		try {
			const item = await this.client
				.selectFrom("food_items")
				.selectAll()
				.where("id", "=", id)
				.executeTakeFirst();
			return Result.ok(item ?? null);
		} catch (err) {
			this.logger.error("failed to find item by id:", id, err);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async updateById(
		id: string,
		payload: FoodItem.Updateable,
	): Promise<Result<FoodItem.Selectable, FoodItemRepositoryError>> {
		try {
			const query = this.client
				.updateTable("food_items")
				.set({
					...payload,
					updated_at: new Date().toISOString(),
				})
				.where("id", "=", id);

			const item = await query.returningAll().executeTakeFirstOrThrow();

			return Result.ok(item);
		} catch (err) {
			this.logger.error("failed to update item by id:", id, err);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async deleteById(
		id: string,
	): Promise<Result<Unit, FoodItemRepositoryError>> {
		try {
			await this.client.deleteFrom("food_items").where("id", "=", id).execute();
			return Result.ok();
		} catch (err) {
			this.logger.error("failed to delete item by id:", id, err);
			return Result.err("ERR_UNEXPECTED");
		}
	}
}

export default FoodItemKyselyRepository;
