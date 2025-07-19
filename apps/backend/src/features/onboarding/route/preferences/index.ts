import { Hono } from 'hono'
import type { Response } from './types'
import { StatusCodes } from '@/features/http'
import middleware from './middleware'
import { Container } from '@n8n/di'
import SetUserPreferencesUseCase from './use-case'
import AuthMiddleware from '@/features/auth/middleware'

const SetUserPreferencesRoute = new Hono().post(
  '/',
  AuthMiddleware.middleware,
  middleware,
  async (c) => {
    let response: Response.Response
    let statusCode: StatusCodes

    const user = c.get('user')
    const payload = c.req.valid('json')
    const useCase = Container.get(SetUserPreferencesUseCase)
    const result = await useCase.execute(payload, user)

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

export default SetUserPreferencesRoute
