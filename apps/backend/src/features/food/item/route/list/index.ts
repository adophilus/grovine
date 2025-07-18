import { Hono } from 'hono'
import type { Response } from './types'
import { StatusCodes } from '@/features/http'
import middleware from './middleware'
import { Container } from '@n8n/di'
import ListFoodItemsUseCase from './use-case'

const ListFoodItemsRoute = new Hono().get('/', middleware, async (c) => {
  let response: Response.Response
  let statusCode: StatusCodes

  const payload = c.req.valid('query')

  const useCase = Container.get(ListFoodItemsUseCase)
  const result = await useCase.execute(payload)

  if (result.isErr) {
    response = result.error
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  } else {
    response = result.value
    statusCode = StatusCodes.OK
  }

  return c.json(response, statusCode)
})

export default ListFoodItemsRoute
