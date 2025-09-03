import { Container } from '@n8n/di'
import { Hono } from 'hono'
import AuthMiddleware from '@/features/auth/middleware'
import { StatusCodes } from '@/features/http'
import middleware from './middleware'
import type { Response } from './types'
import UpdateFoodItemUseCase from './use-case'

const UpdateFoodItemRoute = new Hono().patch(
  '/:id',
  AuthMiddleware.middleware,
  middleware,
  async (c) => {
    let response: Response.Response
    let statusCode: StatusCodes

    const id = c.req.param('id')
    const payload = c.req.valid('form')
    const user = c.get('user')

    const useCase = Container.get(UpdateFoodItemUseCase)
    const result = await useCase.execute(id, payload, user)

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

export default UpdateFoodItemRoute
