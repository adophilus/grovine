import middleware from './middleware'
import { StatusCodes } from '@/features/http'
import { Hono } from 'hono'
import type { Response } from './types'
import { Container } from '@n8n/di'
import UpdateRecipeUseCase from './use-case'
import AuthMiddleware from '@/features/auth/middleware'

const UpdateFoodRecipeRoute = new Hono().patch(
  '/:id',
  AuthMiddleware.middleware,
  ...middleware,
  async (c) => {
    let response: Response.Response
    let statusCode: StatusCodes

    const params = c.req.valid('param')
    const payload = c.req.valid('form')

    const user = c.get('user')

    const useCase = Container.get(UpdateRecipeUseCase)
    const result = await useCase.execute(params, payload, user)

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
  }
)

export default UpdateFoodRecipeRoute
