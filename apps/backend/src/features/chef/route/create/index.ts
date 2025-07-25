import AuthMiddleware from '@/features/auth/middleware'
import { Hono } from 'hono'
import type { Response } from './types'
import { StatusCodes } from '@/features/http'
import { Container } from '@n8n/di'
import CreateChefUseCase from './use-case'
import middleware from './middleware'

const CreateChefRoute = new Hono().post(
  '/',
  AuthMiddleware.middleware,
  middleware,
  async (c) => {
    let response: Response.Success | Response.Error
    let statusCode: StatusCodes

    const payload = c.req.valid('json')
    const user = c.get('user')

    const useCase = Container.get(CreateChefUseCase)

    const result = await useCase.execute(payload, user)

    if (result.isErr) {
      response = result.error

      switch (result.error.code) {
        case 'ERR_CHEF_PROFILE_ALREADY_CREATED': {
          statusCode = StatusCodes.CONFLICT
          break
        }
        default: {
          statusCode = StatusCodes.INTERNAL_SERVER_ERROR
        }
      }
    } else {
      response = result.value
      statusCode = StatusCodes.CREATED
    }

    return c.json(response, statusCode)
  }
)

export default CreateChefRoute
