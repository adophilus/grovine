import middleware from './middleware'
import { StatusCodes } from '@/features/http'
import { Hono } from 'hono'
import type { Response } from './types'
import { Container } from '@n8n/di'
import GetRecipeUseCase from './use-case'

const GetFoodRecipeRoute = new Hono().get('/:id', middleware, async (c) => {
  let response: Response.Response
  let statusCode: StatusCodes

  const payload = c.req.valid('param')

  const useCase = Container.get(GetRecipeUseCase)
  const result = await useCase.execute(payload)

  if (result.isErr) {
    response = result.error
    switch (result.error.code) {
      case 'ERR_RECIPE_NOT_FOUND': {
        statusCode = StatusCodes.NOT_FOUND
        break
      }
      default: {
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR
        break
      }
    }
  } else {
    response = result.value
    statusCode = StatusCodes.OK
  }

  return c.json(response, statusCode)
})

export default GetFoodRecipeRoute
