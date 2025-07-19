import { Hono } from 'hono'
import middleware from './middleware'
import type { Response } from './types'
import { Container } from '@n8n/di'
import UpdateFoodItemUseCase from './use-case'
import { StatusCodes } from '@/features/http'

const UpdateFoodItemRoute = new Hono().patch('/:id', middleware, async (c) => {
  let response: Response.Response
  let statusCode: StatusCodes

  const id = c.req.param('id')
  const payload = c.req.valid('form')

  const useCase = Container.get(UpdateFoodItemUseCase)
  const result = await useCase.execute(id, payload)

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

export default UpdateFoodItemRoute
