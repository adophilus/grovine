import { Hono } from 'hono'
import middleware from './middleware'
import type { Response } from './types'
import service from './service'
import { StatusCodes } from '@/features/http'

export default new Hono().patch('/:id', middleware, async (c) => {
  const id = c.req.param('id')
  const payload = c.req.valid('form')

  const result = await service(id, payload)

  if (result.isErr) {
    return c.json(result.error, StatusCodes.BAD_REQUEST)
  }

  return c.json(result.value, StatusCodes.OK)
})
