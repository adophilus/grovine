import type { Adverts } from "@/types";
import type { Result, Unit } from "true-myth";
import type { Pagination } from "@/features/pagination";

export type AdvertRepositoryError = "ERR_UNEXPECTED";

export abstract class AdvertRepository {
	abstract create(
		payload: Adverts.Insertable,
	): Promise<Result<Adverts.Selectable, AdvertRepositoryError>>;

	abstract findById(
		id: string,
	): Promise<Result<Adverts.Selectable | null, AdvertRepositoryError>>;

	abstract list(
		payload: Pagination.Options,
	): Promise<Result<Adverts.Selectable[], AdvertRepositoryError>>;

	abstract updateById(
		id: string,
		payload: Adverts.Updateable,
	): Promise<Result<Adverts.Selectable, AdvertRepositoryError>>;

	abstract deleteById(id: string): Promise<Result<Unit, AdvertRepositoryError>>;
}
