import { Hono } from 'hono'
import type { Response } from './types'
import { StatusCodes } from '@/features/http'
import AuthMiddleware from '@/features/auth/middleware'
import middleware from './middleware'
import { Container } from '@n8n/di'
import CheckoutCartUseCase from './use-case'

const CheckoutCartRoute = new Hono().post(
  '/',
  AuthMiddleware.middleware,
  middleware,
  async (c) => {
    const user = c.get('user')
    const body = c.req.valid('json')

    const useCase = Container.get(CheckoutCartUseCase)
    const result = await useCase.execute(body, user)

    let response: Response.Response
    let statusCode: StatusCodes

    if (result.isErr) {
      switch (result.error.code) {
        case 'ERR_CART_EMPTY': {
          response = result.error
          statusCode = StatusCodes.BAD_REQUEST
          break
        }
        default: {
          response = result.error
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

export default CheckoutCartRoute
