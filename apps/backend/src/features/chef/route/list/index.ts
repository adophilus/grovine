import { Container } from '@n8n/di'
import { Hono } from 'hono'
import { StatusCodes } from '@/features/http'
import middleware from './middleware'
import type { Response } from './types'
import ListChefUseCase from './use-case'

const ListChefRoute = new Hono().get('/', middleware, async (c) => {
  let response: Response.Success | Response.Error
  let statusCode: StatusCodes

  const payload = c.req.valid('param')

  const useCase = Container.get(ListChefUseCase)

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

export default ListChefRoute
