import middleware from './middleware'
import { StatusCodes } from '@/features/http'
import { Hono } from 'hono'
import type { Response } from './types'
import { Container } from '@n8n/di'
import CreateRecipeUseCase from './use-case'
import AuthMiddleware from '@/features/auth/middleware'

const CreateFoodRecipeRoute = new Hono().post(
  '/',
  AuthMiddleware.middleware,
  middleware,
  async (c) => {
    let response: Response.Response
    let statusCode: StatusCodes

    const payload = c.req.valid('form')
    const user = c.get('user')

    const useCase = Container.get(CreateRecipeUseCase)
    const result = await useCase.execute(payload, user)

    if (result.isErr) {
      response = result.error
      switch (result.error.code) {
        case 'ERR_UNAUTHORIZED': {
          statusCode = StatusCodes.UNAUTHORIZED
          break
        }
        default: {
          statusCode = StatusCodes.INTERNAL_SERVER_ERROR
          break
        }
      }
    } else {
      response = result.value
      statusCode = StatusCodes.CREATED
    }

    return c.json(response, statusCode)
  }
)

export default CreateFoodRecipeRoute
