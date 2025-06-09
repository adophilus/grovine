import { db } from '@/features/database'
import type { Recipe } from '@/types'
import { Result } from 'true-myth'
import { logger } from './logger'

namespace Repository {
	export type Error = 'ERR_UNEXPECTED'

	export type CreateRecipePayload = Recipe.Insertable

	export const createRecipe = async (
		payload: CreateRecipePayload
	): Promise<Result<Recipe.Selectable, Error>> => {
		try {
			const recipe = await db
				.insertInto('recipes')
				.values(payload)
				.returningAll()
				.executeTakeFirstOrThrow()
			return Result.ok(recipe)
		} catch (err) {
			logger.error('failed to create recipe:', err)
			return Result.err('ERR_UNEXPECTED')
		}
	}
	//My changes start here
	export type ListFoodsPayload = {
		categories?: string[];
		limit?: number;
		offset?: number;
	};

	export const listFoods = async (
		payload: ListFoodsPayload = {},
	): Promise<Result<User.Selectable[], Error>> => {
		try {
			const query = db
				.selectFrom("foods")
				.selectAll()

			if (payload.categories) {
				query.where("category", "in", payload.categories);
			}

			if (payload.limit) {
				query.limit(payload.limit);
			}

			if (payload.offset) {
				query.offset(payload.offset);
			}

			const foods = await query.execute();
			return Result.ok(foods);
		} catch (err) {
			logger.error("failed to list foods:", err);
			return Result.err("ERR_UNEXPECTED");
		}
	};

	export type CreateFoodPayload = {
		name: string;
		category: string;
		price: number;
		description?: string;
		image_url?: string;
		is_available?: boolean; // Optional field, added just in case
	}
	export const createFood = async (
		payload: CreateFoodPayload,
	): Promise<Result<any, Error>> => {
		try {
			const food = await db
				.insertInto("foods")
				.values(payload)
				.returningAll()
				.executeTakeFirstOrThrow();
			return Result.ok(food);
		} catch (err) {
			logger.error("failed to create food:", err);
			return Result.err("ERR_UNEXPECTED");
		}
	};

	export type FindFoodByIdPayload = {
		id: string;
	}
	export const findFoodById = async (
		payload: FindFoodByIdPayload,
	): Promise<Result<User.Selectable | null, Error>> => {
		try {
			const food = await db
				.selectFrom("foods")
				.selectAll()
				.where("id", "=", payload.id)
				.executeTakeFirst();
			return Result.ok(food ?? null);
		} catch (err) {
			logger.error("failed to find food by id:", payload.id, err);
			return Result.err("ERR_UNEXPECTED");
		}
	};

	export type UpdateFoodByIdPayload = {
		name?: string;
		category?: string;
		price?: number;
		description?: string;
		image_url?: string;
		is_available?: boolean; // Optional field, still dont know sha
	}

	function cleanPayload(payload: UpdateFoodByIdPayload): Partial<UpdateFoodByIdPayload> {
		return Object.fromEntries(
			Object.entries(payload).filter(([, value]) => value !== undefined)
		)
	}

	export const updateFoodById = async (
		id: string,
		payload: UpdateFoodByIdPayload
	): Promise<Result<Food.Selectable, Error>> => {
		try {
			const cleanedPayload = cleanPayload(payload)

			if (Object.keys(cleanedPayload).length === 0) {
				return Result.err("NO_FIELDS_TO_UPDATE")
			}

			const food = await db
				.updateTable("foods")
				.set({
					...cleanedPayload,
					updated_at: new Date().toISOString()
				})
				.where("id", "=", id)
				.returningAll()
				.executeTakeFirstOrThrow()

			return Result.ok(food)
		} catch (err) {
			logger.error("failed to update food by id:", id, err)
			return Result.err("ERR_UNEXPECTED")
		}
	}


	export type DeleteFoodByIdPayload = {
		id: string;
	};
	export const deleteFoodById = async (
		payload: DeleteFoodByIdPayload,
	): Promise<Result<void, Error>> => {
		try {
			await db
				.deleteFrom("foods")
				.where("id", "=", payload.id)
				.execute();
			return Result.ok(undefined);
		} catch (err) {
			logger.error("failed to delete food by id:", payload.id, err);
			return Result.err("ERR_UNEXPECTED");
		}
	};

	//Advertisement section 
	export type CreateAdvertisementPayload = {
		media: string;
		expires_at: string;
	};

	export const createAdvertisement = async (
		payload: CreateAdvertisementPayload,
	): Promise<Result<Advertisement, Error>> => {
		try {
			const ad = await db
				.insertInto("advertisements")
				.values(payload)
				.returningAll()
				.executeTakeFirstOrThrow();
			return Result.ok(ad);
		} catch (err) {
			logger.error("failed to create advertisement:", err);
			return Result.err("ERR_UNEXPECTED");
		}
	};

	export const listAdvertisements = async (
		limit?: number,
		offset?: number,
	): Promise<Result<Advertisement[], Error>> => {
		try {
			let query = db.selectFrom("advertisements").selectAll();
			if (limit) query = query.limit(limit);
			if (offset) query = query.offset(offset);
			const ads = await query.execute();
			return Result.ok(ads);
		} catch (err) {
			logger.error("failed to list advertisements:", err);
			return Result.err("ERR_UNEXPECTED");
		}
	};

	export const findAdvertisementById = async (
		id: string,
	): Promise<Result<Advertisement | null, Error>> => {
		try {
			const ad = await db
				.selectFrom("advertisements")
				.selectAll()
				.where("id", "=", id)
				.executeTakeFirst();
			return Result.ok(ad ?? null);
		} catch (err) {
			logger.error("failed to find advertisement by id:", id, err);
			return Result.err("ERR_UNEXPECTED");
		}
	};

	export const updateAdvertisementById = async (
		id: string,
		payload: Partial<CreateAdvertisementPayload>,
	): Promise<Result<Advertisement, Error>> => {
		try {
			const ad = await db
				.updateTable("advertisements")
				.set({ ...payload, updated_at: new Date().toISOString() })
				.where("id", "=", id)
				.returningAll()
				.executeTakeFirstOrThrow();
			return Result.ok(ad);
		} catch (err) {
			logger.error("failed to update advertisement by id:", id, err);
			return Result.err("ERR_UNEXPECTED");
		}
	};

	export const deleteAdvertisementById = async (
		id: string,
	): Promise<Result<void, Error>> => {
		try {
			await db.deleteFrom("advertisements")
				.where("id", "=", id)
				.executeTakeFirst();
			return Result.ok(undefined);
		} catch (err) {
			logger.error("failed to delete advertisement by id:", id, err);
			return Result.err("ERR_UNEXPECTED");
		}
	};
	//My changes stopes here

}

export default Repository
