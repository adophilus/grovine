import { Hono } from 'hono'
import { StatusCodes } from '@/features/http'
import * as middleware from './middleware'
import service from './service'

export default new Hono().post(
  '/',
  middleware.header,
  middleware.body,
  async (c) => {
    const payload = c.req.valid('json')

    const result = await service(payload)

    if (result.isErr) {
      return c.json({ code: 'NOT_FOUND' }, StatusCodes.NOT_FOUND)
    }

    return c.json({ code: 'SUCCESSFUL' }, StatusCodes.OK)
  }
)
