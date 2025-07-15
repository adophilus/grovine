import { Service } from "@n8n/di";
import type { AdvertRepository } from "../../repository";
import type { Request, Response } from "./types";
import { Result } from "true-myth";

@Service()
class ListAdvertUseCase {
	constructor(private advertRepository: AdvertRepository) {}

	async execute(
		query: Request.Query,
	): Promise<Result<Response.Success, Response.Error>> {
		const listAdvertsResult = await this.advertRepository.list(query);

		if (listAdvertsResult.isErr) {
			return Result.err({
				code: "ERR_UNEXPECTED",
			});
		}

		const adverts = listAdvertsResult.value;

		return Result.ok({
			code: "LIST",
			data: adverts,
			meta: {
				page: query.page,
				per_page: query.per_page,
				total: adverts.length,
			},
		});
	}
}

export default ListAdvertUseCase;
