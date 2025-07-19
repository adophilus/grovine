import { Hono } from 'hono'
import middleware from './middleware'
import { StatusCodes } from '@/features/http'
import AuthMiddleware from '@/features/auth/middleware'
import type { Response } from './types'
import { Container } from '@n8n/di'
import TopupWalletUseCase from './use-case'

const TopupWalletRoute = new Hono().post(
  '/',
  AuthMiddleware.middleware,
  middleware,
  async (c) => {
    let response: Response.Response
    let statusCode: StatusCodes

    const payload = c.req.valid('json')
    const user = c.get('user')

    const useCase = Container.get(TopupWalletUseCase)
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

export default TopupWalletRoute
