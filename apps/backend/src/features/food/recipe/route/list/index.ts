import middleware from './middleware'
import { StatusCodes } from '@/features/http'
import { Hono } from 'hono'
import type { Response } from './types'
import { Container } from '@n8n/di'
import CreateRecipeUseCase from './use-case'

const ListFoodRecipeRoute = new Hono().post('/', middleware, async (c) => {
  let response: Response.Response
  let statusCode: StatusCodes

  const payload = c.req.valid('query')

  const useCase = Container.get(CreateRecipeUseCase)
  const result = await useCase.execute(payload)

  if (result.isErr) {
    response = result.error
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  } else {
    response = result.value
    statusCode = StatusCodes.CREATED
  }

  return c.json(response, statusCode)
})

export default ListFoodRecipeRoute
