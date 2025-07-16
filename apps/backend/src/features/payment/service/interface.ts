import { Result, Unit } from "true-myth";
import type { CreateInvoicePayload, Webhook } from "../types";

export type PaymentServiceError = "ERR_UNEXPECTED";

abstract class PaymentService {
	public abstract createInvoice(
		payload: CreateInvoicePayload,
	): Promise<Result<{ url: string }, PaymentServiceError>>;

	public abstract handleWebhookEvent(
		event: Webhook.Events.All,
	): Promise<Result<Unit, unknown>>;
}

export default PaymentService;
