import middleware from './middleware'
import { Hono } from 'hono'
import type { Response } from './types'
import { StatusCodes } from '@/features/http'
import service from './service'

export default new Hono().post('/', middleware, async (c) => {
  let response: Response.Response
  let statusCode: StatusCodes

  const payload = c.req.valid('form')

  const result = await service(payload)

  if (result.isErr) {
    switch (result.error.code) {
      default: {
        response = result.error
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR
        break
      }
    }
  } else {
    response = result.value
    statusCode = StatusCodes.CREATED
  }

  return c.json(response, statusCode)
})