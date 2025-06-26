import { Result, type Unit } from 'true-myth'
import type {
  CreateWalletTopupInvoiceMetadataPayload,
  CreatePaymentInvoicePayload,
  Metadata,
  Webhook
} from './types'
import { WalletRepository } from '@/features/wallets'

export const createTopupInvoicePayload = (
  payload: CreateWalletTopupInvoiceMetadataPayload
): CreatePaymentInvoicePayload<Metadata.WalletTopup> => {
  const { wallet_id, ..._payload } = payload

  return {
    ..._payload,
    metadata: {
      type: 'WALLET_TOPUP',
      wallet_id
    }
  }
}

export const handleWebhookEvent = async (
  event: Webhook.Events.All
): Promise<Result<Unit, unknown>> => {
  switch (event.event) {
    case 'charge.success': {
      return await handleChargeSuccessEvent(event)
    }
  }
}

const handleChargeSuccessEvent = async (
  event: Webhook.Events.ChargeSuccess
): Promise<Result<Unit, unknown>> => {
  const payload = event.data
  const metadata = payload.metadata

  if (metadata.type === 'WALLET_TOPUP') {
    const findWalletResult = await WalletRepository.findWalletById(
      metadata.wallet_id
    )

    if (findWalletResult.isErr || !findWalletResult.value)
      return Result.err({ code: 'WALLET_NOT_FOUND' })

    const wallet = findWalletResult.value

    const updateWalletBalanceResult =
      await WalletRepository.updateWalletBalanceById(
        wallet.id,
        payload.amount / 100,
        'CREDIT'
      )

    if (updateWalletBalanceResult.isErr)
      return Result.err({ code: 'ERR_WALLET_UPDATE_BALANCE' })
  }

  return Result.ok()
}
