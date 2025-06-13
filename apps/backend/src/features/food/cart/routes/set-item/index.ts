import { Hono } from 'hono'
import type { Response } from './types'
import { StatusCodes } from '@/features/http'
import { AuthMiddleware } from '@/features/auth'
import service from './service'
import middleware from './middleware'

export default new Hono().put(
  '/',
  AuthMiddleware.middleware,
  middleware,
  async (c) => {
    const user = c.get('user')
    const body = c.req.valid('json')

    const result = await service(body, user.id)

    let response: Response.Response
    let statusCode: StatusCodes

    if (result.isErr) {
      switch (result.error.code) {
        case 'ERR_ITEM_NOT_FOUND': {
          response = result.error
          statusCode = StatusCodes.NOT_FOUND
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
