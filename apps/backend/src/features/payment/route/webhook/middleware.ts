import { zValidator } from '@hono/zod-validator'
import { Request } from './types'
import { StatusCodes } from '@/features/http'
import { config } from '@/features/config'
import crypto from 'node:crypto'

export const header = zValidator(
  'header',
  Request.header,
  async (result, c) => {
    if (!result.success)
      return c.json({ code: 'NOT_FOUND' }, StatusCodes.NOT_FOUND)

    const headerValue = result.data['x-paystack-signature']

    const body = await c.req.arrayBuffer()
    const bodyText = new TextDecoder().decode(body)

    const hash = crypto
      .createHmac('sha512', config.payment.paystack.secretKey)
      .update(bodyText)
      .digest('hex')

    if (hash !== headerValue)
      return c.json({ code: 'NOT_FOUND' }, StatusCodes.NOT_FOUND)
  }
)

export const body = zValidator('json', Request.body)
