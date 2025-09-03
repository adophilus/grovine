import { Container } from '@n8n/di'
import { Hono } from 'hono'
import AuthMiddleware from '@/features/auth/middleware'
import { StatusCodes } from '@/features/http'
import middleware from './middleware'
import type { Response } from './types'
import CartSetItemUseCase from './use-case'

const CartSetItemRoute = new Hono().put(
  '/',
  AuthMiddleware.middleware,
  middleware,
  async (c) => {
    const user = c.get('user')
    const body = c.req.valid('json')

    const useCase = Container.get(CartSetItemUseCase)
    const result = await useCase.execute(body, user)

    let response: Response.Response
    let statusCode: StatusCodes

    if (result.isErr) {
      switch (result.error.code) {
        case 'ERR_ITEM_NOT_FOUND': {
          response = result.error
          statusCode = StatusCodes.NOT_FOUND
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

export default CartSetItemRoute
