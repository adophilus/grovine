import { Container } from '@n8n/di'
import { Hono } from 'hono'
import AuthMiddleware from '@/features/auth/middleware'
import { StatusCodes } from '@/features/http'
import type { Response } from './types'
import GetActiveChefProfileUseCase from './use-case'

const GetActiveChefProfileRoute = new Hono().get(
  '/',
  AuthMiddleware.middleware,
  async (c) => {
    let response: Response.Success | Response.Error
    let statusCode: StatusCodes

    const user = c.get('user')

    const useCase = Container.get(GetActiveChefProfileUseCase)
    const result = await useCase.execute(user)

    if (result.isErr) {
      response = result.error
      statusCode = StatusCodes.NOT_FOUND
    } else {
      response = result.value
      statusCode = StatusCodes.OK
    }

    return c.json(response, statusCode)
  }
)

export default GetActiveChefProfileRoute
