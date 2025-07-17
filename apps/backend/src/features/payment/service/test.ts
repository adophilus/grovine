import { Result, type Unit } from "true-myth";
import type { CreateInvoicePayload, Webhook } from "../types";
import type { PaymentServiceError } from "./interface";
import type PaymentService from "./interface";
import { config } from "@/features/config";
import type { Logger } from "@/features/logger";
import type { WalletRepository } from "@/features/wallet/repository";

class TestPaymentService implements PaymentService {
	constructor(private walletRepository: WalletRepository) {}

	public async createInvoice(
		_: CreateInvoicePayload,
	): Promise<Result<{ url: string }, PaymentServiceError>> {
		const url = new URL(config.server.url);
		url.pathname = "/payment/webhook";

		return Result.ok({ url: url.toString() });
	}

	public async handleWebhookEvent(
		request: Request,
	): Promise<Result<Unit, unknown>> {
		switch (event.event) {
			case "charge.success": {
				return this.handleChargeSuccessWebhookEvent(event);
			}
		}

		return Result.err();
	}

	protected async handleChargeSuccessWebhookEvent(
		event: Webhook.Events.ChargeSuccess,
	): Promise<Result<Unit, unknown>> {
		const payload = event.data;
		const metadata = payload.metadata;

		if (metadata.type === "WALLET_TOPUP") {
			const findWalletResult = await this.walletRepository.findById(
				metadata.wallet_id,
			);

			if (findWalletResult.isErr || !findWalletResult.value)
				return Result.err({ code: "WALLET_NOT_FOUND" });

			const wallet = findWalletResult.value;

			const updateWalletBalanceResult =
				await this.walletRepository.updateBalanceById(
					wallet.id,
					payload.amount / 100,
					"CREDIT",
				);

			if (updateWalletBalanceResult.isErr)
				return Result.err({ code: "ERR_WALLET_UPDATE_BALANCE" });
		}

		return Result.ok();
	}
}

export default TestPaymentService;
