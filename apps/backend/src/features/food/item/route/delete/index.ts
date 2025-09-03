import { Container } from '@n8n/di'
import { Hono } from 'hono'
import AuthMiddleware from '@/features/auth/middleware'
import { StatusCodes } from '@/features/http'
import type { Response } from './types'
import DeleteFoodItemUseCase from './use-case'

const DeleteFoodItemRoute = new Hono().delete(
  '/:id',
  AuthMiddleware.middleware,
  async (c) => {
    const id = c.req.param('id')
    const user = c.get('user')

    const useCase = Container.get(DeleteFoodItemUseCase)
    const result = await useCase.execute(id, user)

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
  }
)

export default DeleteFoodItemRoute
