import { Paystack } from "paystack-sdk";
import crypto from "node:crypto";
import { Result, Unit } from "true-myth";
import { type CreateInvoicePayload, Webhook } from "../types";
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

	private async validateRequestPayload(
		request: Request,
	): Promise<Result<Webhook.Events.All, "ERR_VALIDATION">> {
		const paystackSignature = request.headers.get("x-paystack-signature");

		if (!paystackSignature) return Result.err("ERR_VALIDATION");

		const rawBody = await request.arrayBuffer();
		const textBody = new TextDecoder().decode(rawBody);

		const hash = crypto
			.createHmac("sha512", config.payment.paystack.secretKey)
			.update(textBody)
			.digest("hex");

		if (hash !== paystackSignature) {
			return Result.err("ERR_VALIDATION");
		}

		let jsonBody: Webhook.Events.All;

		try {
			jsonBody = Webhook.Events.all.parse(JSON.parse(textBody));
		} catch (err) {
			return Result.err("ERR_VALIDATION");
		}

		return Result.ok(jsonBody);
	}

	public async handleWebhookEvent(
		request: Request,
	): Promise<Result<Unit, unknown>> {
		const validationResult = await this.validateRequestPayload(request);

		if (validationResult.isErr) {
			return Result.err();
		}

		const event = validationResult.value;

		switch (event.event) {
			case "charge.success": {
				return this.handleChargeSuccessWebhookEvent(event);
			}
		}

		return Result.err();
	}

	private async handleChargeSuccessWebhookEvent(
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
