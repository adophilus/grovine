import { Hono } from 'hono'
import type { Response } from './types'
import { StatusCodes } from '@/features/http'
import { Container } from '@n8n/di'
import SearchFoodItemsUseCase from './use-case'

const SearchFoodItemsRoute = new Hono().get('/', async (c) => {
  let response: Response.Response
  let statusCode: StatusCodes

  const query = c.req.query()

  const useCase = Container.get(SearchFoodItemsUseCase)
  const result = await useCase.execute({
    page: query.page ? Number(query.page) : 1,
    per_page: query.per_page ? Number(query.per_page) : 10,
    q: query.q,
  })

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
