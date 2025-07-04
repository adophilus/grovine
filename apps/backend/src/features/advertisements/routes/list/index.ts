import { Hono } from 'hono'
import service from './service'
import type { Response } from './types'
import { StatusCodes } from '@/features/http'
import middleware from './middleware'

export default new Hono().get('/', middleware, async (c) => {
  let response: Response.Response
  let statusCode: StatusCodes

  const payload = c.req.valid('query')
  const result = await service(payload)

  if (result.isErr) {
    response = result.error
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  }
  else {
    response = result.value
    statusCode = StatusCodes.OK
  }

  return c.json(response, statusCode)
})
