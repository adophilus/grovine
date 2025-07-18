import type {
  CreateWalletTopupInvoiceMetadataPayload,
  CreateInvoicePayload,
  Metadata
} from './types'

export const createWalletTopupInvoicePayload = (
  payload: CreateWalletTopupInvoiceMetadataPayload
): CreateInvoicePayload<Metadata.WalletTopup> => {
  const { wallet_id, ..._payload } = payload

  return {
    ..._payload,
    metadata: {
      type: 'WALLET_TOPUP',
      wallet_id
    }
  }
}
