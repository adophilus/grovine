import { Result } from "true-myth";
import type { Request, Response } from "./types";
import type { User } from "@/types";
import Repository from "../../repository";
import Payment from "@/features/payment";
import assert from "node:assert";

export default async (
	payload: Request.Body,
	actor: User.Selectable,
): Promise<Result<Response.Success, Response.Error>> => {
	const findWalletResult = await Repository.findWalletByUserId(actor.id);
	if (findWalletResult.isErr) {
		return Result.err({
			code: "ERR_UNEXPECTED",
		});
	}

	const wallet = findWalletResult.value;

	assert(wallet, "Impossible for user to not have a wallet");

	const topupInvoiceResult = await Payment.service.createPaymentInvoice(
		Payment.utils.createTopupInvoicePayload({
			email: actor.email,
			amount: payload.amount,
			wallet_id: wallet.id,
		}),
	);

	if (topupInvoiceResult.isErr) {
		return Result.err({
			code: "ERR_UNEXPECTED",
		});
	}

	const topupInvoice = topupInvoiceResult.value;

	return Result.ok({
		code: "WALLET_TOPUP_REQUEST_SUCCESSFUL",
		data: {
			url: topupInvoice.url,
		},
	});
};
