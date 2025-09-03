import { Container } from '@n8n/di'
import { Hono } from 'hono'
import AuthMiddleware from '@/features/auth/middleware'
import { StatusCodes } from '@/features/http'
import type { User } from '@/types'
import middleware from './middleware'
import type { Response } from './types'
import ListOrdersUseCase from './use-case'

const ListOrdersRoute = new Hono().get(
  '/',
  AuthMiddleware.middleware,
  middleware,
  async (c) => {
    let response: Response.Response
    let statusCode: StatusCodes

    const user = c.get('user') as User.Selectable
    const payload = c.req.valid('query')
    const useCase = Container.get(ListOrdersUseCase)
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

export default ListOrdersRoute
