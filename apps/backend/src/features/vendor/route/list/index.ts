import middleware from './middleware'
import { Hono } from 'hono'
import type { Response } from './types'
import { StatusCodes } from '@/features/http'
import { Container } from '@n8n/di'
import ListVendorUseCase from './use-case'

export const ListVendorRoute = new Hono().get('/', middleware, async (c) => {
  let response: Response.Success | Response.Error
  let statusCode: StatusCodes

  const payload = c.req.valid('param')

  const useCase = Container.get(ListVendorUseCase)

  const result = await useCase.execute(payload)

  if (result.isErr) {
    response = result.error
    statusCode = StatusCodes.NOT_FOUND
  } else {
    response = result.value
    statusCode = StatusCodes.OK
  }

  return c.json(response, statusCode)
})
