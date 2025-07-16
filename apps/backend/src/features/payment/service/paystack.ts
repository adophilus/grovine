import { Paystack } from "paystack-sdk";
import { Result, Unit } from "true-myth";
import type { CreateInvoicePayload, Webhook } from "../types";
import { config } from "@/features/config";
import type PaymentService from "./interface";
import type { PaymentServiceError } from "./interface";
import type { Logger } from "@/features/logger";
import type { WalletRepository } from "@/features/wallet/repository";

class PaystackPaymentService implements PaymentService {
	private declare client: Paystack;

	constructor(
		private walletRepository: WalletRepository,
		private logger: Logger,
	) {
		this.client = new Paystack(config.payment.paystack.secretKey);
	}

	public async createInvoice(
		payload: CreateInvoicePayload,
	): Promise<Result<{ url: string }, PaymentServiceError>> {
		const response = await this.client.transaction.initialize({
			...payload,
			amount: (payload.amount * 100).toString(),
		});

		if (!response.data) {
			this.logger.error("Failed to create payment invoice", response.message);
			return Result.err("ERR_UNEXPECTED");
		}

		return Result.ok({ url: response.data.authorization_url });
	}

	public async handleWebhookEvent(
		event: Webhook.Events.All,
	): Promise<Result<Unit, unknown>> {
		switch (event.event) {
			case "charge.success": {
				return await this.handleChargeSuccessWebhookEvent(event);
			}
		}
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

export default PaystackPaymentService;
