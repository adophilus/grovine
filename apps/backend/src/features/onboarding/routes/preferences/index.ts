import { AuthMiddleware } from '@/features/auth'
import { Hono } from 'hono'
import middleware from './middleware'
import type { Response } from './types'
import { StatusCodes } from '@/features/http'
import service from './service'

export default new Hono().post(
  '/',
  AuthMiddleware.middleware,
  middleware,
  async (c) => {
    let response: Response.Response
    let statusCode: StatusCodes

    const payload = c.req.valid('json')
    const user = c.get('user')

    const result = await service(payload, user)

    if (result.isErr) {
      switch (result.error.code) {
        case 'ERR_USER_ALREADY_ONBOARDED': {
          response = result.error
          statusCode = StatusCodes.CONFLICT
          break
        }
        default: {
          response = result.error
          statusCode = StatusCodes.INTERNAL_SERVER_ERROR
          break
        }
      }
    } else {
      response = result.value
      statusCode = StatusCodes.OK
    }

    return c.json(response, statusCode)
  }
)
