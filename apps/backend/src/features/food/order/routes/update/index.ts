import { Hono } from 'hono'
import type { Response } from './types'
import { StatusCodes } from '@/features/http'
import { AuthMiddleware } from '@/features/auth'
import service from './service'
import middleware from './middleware'

export default new Hono().put(
  '/:id',
  AuthMiddleware.middleware,
  middleware,
  async (c) => {
    const path = c.req.param()
    const body = c.req.valid('json')

    const result = await service({ ...body, ...path })

    let response: Response.Response
    let statusCode: StatusCodes

    if (result.isErr) {
      response = result.error
      switch (result.error.code) {
        case 'ERR_ORDER_NOT_FOUND': {
          statusCode = StatusCodes.NOT_FOUND
          break
        }
        default: {
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
