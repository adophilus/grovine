import { Hono } from 'hono'
import middleware from './middleware'
import service from './service'
import { StatusCodes } from '@/features/http'
import { AuthMiddleware } from '@/features/auth'

export default new Hono().post(
  '/',
  AuthMiddleware.middleware,
  middleware,
  async (c) => {
    const payload = c.req.valid('json')
    const user = c.get('user')

    const result = await service(payload, user)

    if (result.isErr) {
      return c.json(result.error, StatusCodes.BAD_REQUEST)
    }

    return c.json(result.value, StatusCodes.OK)
  }
)
