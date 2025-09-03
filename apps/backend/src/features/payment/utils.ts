import type {
  CreateInvoicePayload,
  CreateOrderInvoiceMetadataPayload,
  CreateWalletTopupInvoiceMetadataPayload,
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

export const createOrderInvoicePayload = (
  payload: CreateOrderInvoiceMetadataPayload
): CreateInvoicePayload<Metadata.Order> => {
  const { order_id, ..._payload } = payload

  return {
    ..._payload,
    metadata: {
      type: 'ORDER',
      order_id
    }
  }
}
