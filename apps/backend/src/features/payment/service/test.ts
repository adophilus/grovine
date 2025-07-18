import { Result, type Unit } from "true-myth";
import { Webhook, type CreateInvoicePayload } from "../types";
import type { PaymentServiceError } from "./interface";
import type PaymentService from "./interface";
import type { WalletRepository } from "@/features/wallet/repository";
import { decodeBase64UrlString, encodeBase64Url } from "effect/Encoding";
import { Either } from "effect";

class TestPaymentService implements PaymentService {
	constructor(private walletRepository: WalletRepository) {}

	public async createInvoice(
		invoicePayload: CreateInvoicePayload,
	): Promise<Result<{ url: string }, PaymentServiceError>> {
		const payload = Webhook.Events.all.parse({
			event: "charge.success",
			data: {
				amount: invoicePayload.amount,
				metadata: invoicePayload.metadata,
			},
		});

		const serializedPayload = encodeBase64Url(JSON.stringify(payload));

		const url = `/payment/webhook?payload=${serializedPayload}`;

		return Result.ok({ url });
	}

	public async handleWebhookEvent(
		request: Request,
	): Promise<Result<Unit, unknown>> {
		const url = new URL(request.url);

		const serializedPayload = url.searchParams.get("payload");
		if (!serializedPayload) {
			return Result.err();
		}

		const payloadString = Either.getOrUndefined(
			decodeBase64UrlString(serializedPayload),
		);

		if (!payloadString) {
			return Result.err();
		}

		let event: Webhook.Events.All;

		try {
			const payload = JSON.parse(payloadString);
			event = Webhook.Events.all.parse(payload);
		} catch (err) {
			return Result.err();
		}

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
