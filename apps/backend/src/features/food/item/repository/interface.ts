import type { FoodItem } from "@/types";
import { Result, Unit } from "true-myth";
import type { Pagination } from "@/features/pagination";

export type FoodItemRepositoryError = "ERR_UNEXPECTED";

abstract class FoodItemRepository {
	public abstract create(
		payload: FoodItem.Insertable,
	): Promise<Result<FoodItem.Selectable, FoodItemRepositoryError>>;

	public abstract list(
		payload: Pagination.Options,
	): Promise<Result<FoodItem.Selectable[], FoodItemRepositoryError>>;

	public abstract findById(
		id: string,
	): Promise<Result<FoodItem.Selectable | null, FoodItemRepositoryError>>;

	public abstract updateById(
		id: string,
		payload: FoodItem.Updateable,
	): Promise<Result<FoodItem.Selectable, FoodItemRepositoryError>>;

	public abstract deleteById(id: string): Promise<Result<Unit, FoodItemRepositoryError>>;
}

export default FoodItemRepository;
