import type { Result, Unit } from 'true-myth'
import type { CreateInvoicePayload, Webhook } from '../types'

export type PaymentServiceError = 'ERR_UNEXPECTED'

abstract class PaymentService {
  public abstract createInvoice(
    payload: CreateInvoicePayload
  ): Promise<Result<{ url: string }, PaymentServiceError>>

  public abstract handleWebhookEvent(
    request: Request
  ): Promise<Result<Unit, unknown>>
}

export default PaymentService
