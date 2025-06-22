import { Paystack } from 'paystack-sdk'
import { Result } from 'true-myth'
import logger from './logger'

namespace PaymentService {
  type Error = 'ERR_UNEXPECTED'

  const paystack = new Paystack('sk_test_1234567890')

  export type CreatePaymentInvoicePayload = {
    amount: number
    email: string
    reference: string
  }

  export const createPaymentInvoice = async (
    payload: CreatePaymentInvoicePayload
  ): Promise<Result<{ url: string }, Error>> => {
    const response = await paystack.transaction.initialize({
      amount: payload.amount.toString(),
      email: payload.email
    })

    if (!response.data) {
      logger.error('Failed to create payment invoice', response.message)
      return Result.err('ERR_UNEXPECTED')
    }

    return Result.ok({ url: response.data.authorization_url })
  }
}

export default PaymentService
