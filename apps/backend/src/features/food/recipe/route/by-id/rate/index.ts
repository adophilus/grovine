import AuthMiddleware from '@/features/auth/middleware'
import { Hono } from 'hono'
import type { Response } from './types'
import { StatusCodes } from '@/features/http'
import { Container } from '@n8n/di'
import RateRecipeByIdUseCase from './use-case'
import middleware from './middleware'

const RateRecipeByIdRoute = new Hono().put(
  '/',
  AuthMiddleware.middleware,
  ...middleware,
  async (c) => {
    let response: Response.Response
    let statusCode: StatusCodes

    const user = c.get('user')
    const path = c.req.valid('param')
    const payload = c.req.valid('json')

    const useCase = Container.get(RateRecipeByIdUseCase)
    const result = await useCase.execute({ ...payload, ...path }, user)

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

export default RateRecipeByIdRoute
