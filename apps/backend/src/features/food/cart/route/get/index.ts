import { Container } from '@n8n/di'
import { Hono } from 'hono'
import AuthMiddleware from '@/features/auth/middleware'
import { StatusCodes } from '@/features/http'
import type { Response } from './types'
import GetCartUseCase from './use-case'

const GetCartRoute = new Hono().get(
  '/',
  AuthMiddleware.middleware,
  async (c) => {
    const user = c.get('user')

    const useCase = Container.get(GetCartUseCase)
    const result = await useCase.execute(user)

    let response: Response.Response
    let statusCode: StatusCodes

    if (result.isErr) {
      response = result.error
      statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    } else {
      response = result.value
      statusCode = StatusCodes.OK
    }

    return c.json(response, statusCode)
  }
)

export default GetCartRoute
