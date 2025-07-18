import { Hono } from 'hono'
import type { Response } from './types'
import { StatusCodes } from '@/features/http'
import { Container } from '@n8n/di'
import GetFoodItemUseCase from './use-case'

const GetFoodItemRoute = new Hono().get('/:id', async (c) => {
  let response: Response.Response
  let statusCode: StatusCodes

  const id = c.req.param('id')

  const useCase = Container.get(GetFoodItemUseCase)
  const result = await useCase.execute(id)

  if (result.isErr) {
    switch (result.error.code) {
      case 'ERR_ITEM_NOT_FOUND': {
        response = result.error
        statusCode = StatusCodes.NOT_FOUND
        break
      }
      default: {
        response = result.error
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

export default GetFoodItemRoute
