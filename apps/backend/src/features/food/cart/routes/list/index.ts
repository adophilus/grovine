import { Hono } from 'hono'
import type { Response } from './types'
import { StatusCodes } from '@/features/http'
import { AuthMiddleware } from '@/features/auth'
import service from './service'

export default new Hono().get('/', AuthMiddleware.middleware, async (c) => {
  const user = c.get('user')

  const result = await service(user.id)

  let response: Response.Response
  let statusCode: StatusCodes

  if (result.isErr) {
    response = result.error
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  } else {
    response = result.value
    statusCode = StatusCodes.OK
  }

  return c.json(response, statusCode)
})
