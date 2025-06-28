import { Hono } from 'hono'
import service from './service'
import type { Response } from './types'
import { StatusCodes } from '@/features/http'
import middleware from './middleware'
import { AuthMiddleware } from '@/features/auth'

export default new Hono().get(
  '/',
  AuthMiddleware.middleware,
  middleware,
  async (c) => {
    let response: Response.Response
    let statusCode: StatusCodes

    const user = c.get('user')
    const payload = c.req.valid('query')
    const result = await service(payload, user)

    if (result.isErr) {
      response = result.error
      statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    } else {
      response = result.value
      statusCode = StatusCodes.OK
    }

    return c.json(response, statusCode)
  }
)
