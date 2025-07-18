import type { Result } from 'true-myth'
import type PaymentService from '../../service/interface'

class WebhookUseCase {
  constructor(private paymentService: PaymentService) {}

  public async execute(payload: Request): Promise<Result<unknown, unknown>> {
    return this.paymentService.handleWebhookEvent(payload)
  }
}

export default WebhookUseCase
