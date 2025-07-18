import { z } from 'zod'

export namespace Metadata {
  export const walletTopup = z.object({
    type: z.literal('WALLET_TOPUP'),
    wallet_id: z.string()
  })

  export type WalletTopup = z.infer<typeof walletTopup>

  export const order = z.object({
    type: z.literal('ORDER'),
    order_id: z.string()
  })

  export type Order = z.infer<typeof order>

  export const all = z.discriminatedUnion('type', [walletTopup, order])
}

export type CreateWalletTopupInvoiceMetadataPayload = {
  amount: number
  email: string
  reference?: string
  wallet_id: string
}

export type CreateOrderInvoiceMetadataPayload = {
  amount: number
  email: string
  reference?: string
  order_id: string
}

export type CreateInvoicePayload<T extends Record<string, unknown> = {}> = {
  amount: number
  email: string
  reference?: string
  metadata?: T
}

export namespace Webhook {
  export namespace Events {
    export const chargeSuccess = z.object({
      event: z.literal('charge.success'),
      data: z.object({
        amount: z.number(),
        metadata: Metadata.all
      })
    })

    export type ChargeSuccess = z.infer<typeof chargeSuccess>

    export const all = z.discriminatedUnion('event', [chargeSuccess])
    export type All = z.infer<typeof all>
  }
}
