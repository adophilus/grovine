import { Hono } from 'hono'
import { Container } from '@n8n/di'
import DeleteFoodItemUseCase from './use-case'
import type { Response } from './types'
import { StatusCodes } from '@/features/http'

const DeleteFoodItemRoute = new Hono().delete('/:id', async (c) => {
  const id = c.req.param('id')
  const useCase = Container.get(DeleteFoodItemUseCase)
  const result = await useCase.execute(id)
  let response: Response.Response
  let statusCode: StatusCodes

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

export default DeleteFoodItemRoute
