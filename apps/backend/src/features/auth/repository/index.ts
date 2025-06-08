import { db } from "@/features/database";
import type { Token, User } from "@/types";
import { Result } from "true-myth";
import { logger } from "./logger";

namespace Repository {
	export type Error = "ERR_UNEXPECTED";

	export type CreateUserPayload = User.Insertable;

	export const createUser = async (
		payload: CreateUserPayload,
	): Promise<Result<User.Selectable, Error>> => {
		try {
			const user = await db
				.insertInto("users")
				.values(payload)
				.returningAll()
				.executeTakeFirstOrThrow();
			return Result.ok(user);
		} catch (err) {
			logger.error("failed to create user:", err);
			return Result.err("ERR_UNEXPECTED");
		}
	};

	export const findUserByEmail = async (
		email: string,
	): Promise<Result<User.Selectable | null, Error>> => {
		try {
			const user = await db
				.selectFrom("users")
				.selectAll()
				.where("email", "=", email)
				.executeTakeFirst();
			return Result.ok(user ?? null);
		} catch (err) {
			logger.error("failed to find user by email:", err);
			return Result.err("ERR_UNEXPECTED");
		}
	};

	export type FindUserByIdPayload = { id: string };

	export const findUserById = async (
		payload: FindUserByIdPayload,
	): Promise<Result<User.Selectable | null, Error>> => {
		try {
			const user = await db
				.selectFrom("users")
				.selectAll()
				.where("id", "=", payload.id)
				.executeTakeFirst();
			return Result.ok(user ?? null);
		} catch (err) {
			logger.error("failed to find user by id");
			return Result.err("ERR_UNEXPECTED");
		}
	};

	export type UpdateUserByIdPayload = Omit<
		User.Updateable,
		"id" | "referral_code" | "updated_at"
	>;

	export const updateUserById = async (
		id: string,
		payload: UpdateUserByIdPayload,
	): Promise<Result<User.Selectable, Error>> => {
		try {
			const user = await db
				.updateTable("users")
				.set(
					Object.assign(payload, {
						updated_at: new Date().toISOString(),
					}),
				)
				.where("id", "=", id)
				.returningAll()
				.executeTakeFirstOrThrow();
			return Result.ok(user);
		} catch (err) {
			logger.error(
				"failed to update user by id with payload",
				id,
				payload,
				err,
			);
			return Result.err("ERR_UNEXPECTED");
		}
	};

	export type CreateToken = Token.Insertable;

	export const createToken = async (
		payload: CreateToken,
	): Promise<Result<Token.Selectable, Error>> => {
		try {
			const token = await db
				.insertInto("tokens")
				.values(payload)
				.returningAll()
				.executeTakeFirstOrThrow();
			return Result.ok(token);
		} catch (err) {
			logger.error("failed to create sign up verification token:", err);
			return Result.err("ERR_UNEXPECTED");
		}
	};

	export type FindTokenByUserIdAndPurposePayload = {
		user_id: string;
		purpose: string;
	};

	export const findTokenByUserIdAndPurpose = async (
		payload: FindTokenByUserIdAndPurposePayload,
	): Promise<Result<Token.Selectable | null, Error>> => {
		try {
			const token = await db
				.selectFrom("tokens")
				.selectAll()
				.where("user_id", "=", payload.user_id)
				.where("purpose", "=", payload.purpose)
				.executeTakeFirst();
			return Result.ok(token ?? null);
		} catch (err) {
			logger.error(
				"failed to find token by user id and purpose:",
				payload.user_id,
				payload.purpose,
				err,
			);
			return Result.err("ERR_UNEXPECTED");
		}
	};

	export type UpdateTokenByIdPayload = Omit<
		Token.Updateable,
		"id" | "purpose" | "user_id" | "updated_at"
	>;

	export const updateTokenById = async (
		id: Token.Selectable["id"],
		payload: UpdateTokenByIdPayload,
	): Promise<Result<Token.Selectable, Error>> => {
		try {
			const token = await db
				.updateTable("tokens")
				.set(payload)
				.where("id", "=", id)
				.returningAll()
				.executeTakeFirstOrThrow();
			return Result.ok(token);
		} catch (err) {
			logger.error("failed to update token by id:", id, err);
			return Result.err("ERR_UNEXPECTED");
		}
	};

	//Everything below is my addition
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
	export const updateFoodById = async (
		id: string,
		payload: UpdateFoodByIdPayload,
	): Promise<Result<User.Selectable, Error>> => {
		try {
			const food = await db
				.updateTable("foods")
				.set(
					Object.assign(payload, {
						updated_at: new Date().toISOString(),
					}),
				)
				.where("id", "=", id)
				.returningAll()
				.executeTakeFirstOrThrow();
			return Result.ok(food);
		} catch (err) {
			logger.error("failed to update food by id:", id, err);
			return Result.err("ERR_UNEXPECTED");
		}
	};

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

export default Repository;
