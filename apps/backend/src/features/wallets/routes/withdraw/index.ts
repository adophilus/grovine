import { Hono } from 'hono'
import middleware from './middleware'
import type { Response } from './types'
import service from './service'
import { StatusCodes } from '@/features/http'

export default new Hono().post('/', middleware, async (c) => { 
  const payload = c.req.valid('form')

  const result = await service(payload)

  if (result.isErr) {
    return c.json(result.error, StatusCodes.BAD_REQUEST)
  }

  return c.json(result.value, StatusCodes.OK)
})