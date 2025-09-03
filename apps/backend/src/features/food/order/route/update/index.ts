import { Container } from '@n8n/di'
import { Hono } from 'hono'
import AuthMiddleware from '@/features/auth/middleware'
import { StatusCodes } from '@/features/http'
import middleware from './middleware'
import type { Response } from './types'
import UpdateOrderStatusUseCase from './use-case'

const UpdateOrderStatusRoute = new Hono().put(
  '/:id',
  AuthMiddleware.middleware,
  middleware,
  async (c) => {
    const path = c.req.param()
    const body = c.req.valid('json')
    const useCase = Container.get(UpdateOrderStatusUseCase)
    const result = await useCase.execute({ ...body, ...path })

    let response: Response.Response
    let statusCode: StatusCodes

    if (result.isErr) {
      response = result.error
      switch (result.error.code) {
        case 'ERR_ORDER_NOT_FOUND': {
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

export default UpdateOrderStatusRoute
