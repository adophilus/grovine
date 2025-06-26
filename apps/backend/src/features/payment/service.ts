import { Paystack } from 'paystack-sdk'
import { Result } from 'true-myth'
import logger from './logger'
import type { CreatePaymentInvoicePayload } from './types'
import { config } from '@/features/config'

namespace PaymentService {
  type Error = 'ERR_UNEXPECTED'

  const paystack = new Paystack(config.payment.paystack.secretKey)

  export const createPaymentInvoice = async (
    payload: CreatePaymentInvoicePayload
  ): Promise<Result<{ url: string }, Error>> => {
    const response = await paystack.transaction.initialize({
      ...payload,
      amount: (payload.amount * 100).toString()
    })

    if (!response.data) {
      logger.error('Failed to create payment invoice', response.message)
      return Result.err('ERR_UNEXPECTED')
    }

    return Result.ok({ url: response.data.authorization_url })
  }
}

export default PaymentService
