import { Hono } from 'hono'
import type { Response } from './types'
import { StatusCodes } from '@/features/http'
import { AuthMiddleware } from '@/features/auth'
import service from './service'

export default new Hono().get('/:id', AuthMiddleware.middleware, async (c) => {
  let response: Response.Response
  let statusCode: StatusCodes

  const payload = c.req.param()

  const result = await service(payload)

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
})
