import AuthMiddleware from '@/features/auth/middleware'
import { Hono } from 'hono'
import type { Response } from './types'
import { StatusCodes } from '@/features/http'
import { Container } from '@n8n/di'
import RateChefProfileByIdUseCase from './use-case'
import middleware from './middleware'

const RateChefProfileByIdRoute = new Hono().put(
  '/',
  AuthMiddleware.middleware,
  ...middleware,
  async (c) => {
    let response: Response.Response
    let statusCode: StatusCodes

    const user = c.get('user')
    const param = c.req.valid('param')
    const payload = c.req.valid('json')

    const useCase = Container.get(RateChefProfileByIdUseCase)
    const result = await useCase.execute(param.id, payload, user)

    if (result.isErr) {
      response = result.error
      switch (result.error.code) {
        case 'ERR_CHEF_PROFILE_NOT_FOUND': {
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

export default RateChefProfileByIdRoute
