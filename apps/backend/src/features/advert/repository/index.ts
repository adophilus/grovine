import { db } from "@/features/database";
import type { Adverts } from "@/types";
import { Result, Unit } from "true-myth";
import type { Pagination } from "@/features/pagination";
import { logger } from "./logger";

namespace Repository {
	export type Error = "ERR_UNEXPECTED";
	export type CreateAdvertPayload = Adverts.Insertable;

	export const CreateAdvert = async (
		payload: CreateAdvertPayload,
	): Promise<Result<Adverts.Selectable, Error>> => {
		try {
			const advert = await db
				.insertInto("adverts")
				.values(payload)
				.returningAll()
				.executeTakeFirstOrThrow();
			return Result.ok(advert);
		} catch (err) {
			logger.error("failed to create advert", err);
			return Result.err("ERR_UNEXPECTED");
		}
	};

	export type FindAdvertByIdPayload = { id: string };
	export const findAdvertById = async (
		id: string,
	): Promise<Result<Adverts.Selectable | null, Error>> => {
		try {
			const advert = await db
				.selectFrom("adverts")
				.selectAll()
				.where("id", "=", id)
				.executeTakeFirst();
			return Result.ok(advert ?? null);
		} catch (err) {
			logger.error("failed to get advert by id", err);
			return Result.err("ERR_UNEXPECTED");
		}
	};

	export type UpdateAdvertByIdPayload = Adverts.Updateable;
	export const updateAdvertById = async (
		id: string,
		payload: UpdateAdvertByIdPayload,
	): Promise<Result<Adverts.Selectable, Error>> => {
		try {
			const query = db
				.updateTable("adverts")
				.set({
					...payload,
					updated_at: new Date().toISOString(),
				})
				.where("id", "=", id);

			const outcome = await query.returningAll().executeTakeFirstOrThrow();
			return Result.ok(outcome);
		} catch (err) {
			logger.error("failde to update advert by id:", id, err);
			return Result.err("ERR_UNEXPECTED");
		}
	};

	export const deleteAdvertById = async (
		id: string,
	): Promise<Result<Unit, Error>> => {
		try {
			await db.deleteFrom("adverts").where("id", "=", id).execute();
			return Result.ok();
		} catch (err) {
			logger.error("failed to delete the specified advert: ", id, err);
			return Result.err("ERR_UNEXPECTED");
		}
	};

	export type ListAdvertsPayload = Pagination.Options;
	export const listAdverts = async (
		payload: ListAdvertsPayload,
	): Promise<Result<Adverts.Selectable[], Error>> => {
		try {
			const adverts = await db
				.selectFrom("adverts")
				.selectAll()
				.limit(payload.per_page)
				.offset(payload.per_page)
				.execute();
			return Result.ok(adverts);
		} catch (err) {
			logger.error("failed to list adverts:", err);
			return Result.err("ERR_UNEXPECTED");
		}
	};
}

export default Repository;

