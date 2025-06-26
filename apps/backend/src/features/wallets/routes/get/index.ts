import { Hono } from 'hono'
import type { Response } from './types'
import service from './service'
import { StatusCodes } from '@/features/http'
import AuthMiddleware from '@/features/auth/middleware'

export default new Hono().get('/', AuthMiddleware.middleware, async (c) => {
  let response: Response.Response
  let statusCode: StatusCodes

  const user = c.get('user')

  const result = await service(user)

  if (result.isErr) {
    response = result.error
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  } else {
    response = result.value
    statusCode = StatusCodes.OK
  }

  return c.json(response, statusCode)
})
