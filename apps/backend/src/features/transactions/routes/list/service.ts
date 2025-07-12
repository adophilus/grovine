import Repository from "../../repository";
import { serializeTransaction } from "../../utils";
import type { Request, Response } from "./types";
import { Result } from "true-myth";

export default async (
	query: Request.Query,
): Promise<Result<Response.Success, Response.Error>> => {
	const listTransactionsResult = await Repository.getTransactions(query);

	if (listTransactionsResult.isErr) {
		return Result.err({
			code: "ERR_UNEXPECTED",
		});
	}

	const transactions = listTransactionsResult.value;

	return Result.ok({
		code: "LIST",
		data: transactions.map(serializeTransaction),
		meta: {
			page: query.page,
			per_page: query.per_page,
			total: transactions.length,
		},
	});
};
