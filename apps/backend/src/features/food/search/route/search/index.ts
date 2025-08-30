import { Hono } from 'hono'
import type { Response } from './types'
import { StatusCodes } from '@/features/http'
import { Container } from '@n8n/di'
import SearchFoodItemsUseCase from './use-case'
import middleware from './middleware'

const SearchFoodItemsRoute = new Hono().get('/', middleware, async (c) => {
  let response: Response.Response
  let statusCode: StatusCodes

  const query = c.req.valid('query')

  const useCase = Container.get(SearchFoodItemsUseCase)
  const result = await useCase.execute(query)

  if (result.isErr) {
    response = result.error
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  } else {
    response = result.value
    statusCode = StatusCodes.OK
  }

  return c.json(response, statusCode)
})

export default SearchFoodItemsRoute
