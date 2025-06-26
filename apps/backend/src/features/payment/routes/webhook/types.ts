import z from 'zod'
import { Webhook } from '../../types'

export namespace Request {
  export const header = z.object({
    'x-paystack-signature': z.string()
  })

  export const body = Webhook.Events.all
  export type Body = Webhook.Events.All
}
