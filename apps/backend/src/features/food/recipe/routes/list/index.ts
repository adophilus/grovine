import { Hono } from 'hono'
import service from './service'
import type { Response } from './types'
import { StatusCodes } from '@/features/http'

export default new Hono().get('/', async (c) => {
  const searchParams = c.req.query()
  const result = await service(searchParams)

  if (result.isErr) {
    return c.json(result.error, StatusCodes.INTERNAL_SERVER_ERROR)
  }

  return c.json(result.value, StatusCodes.OK)
})
