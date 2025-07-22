import AuthMiddleware from '@/features/auth/middleware'
import { Hono } from 'hono'
import type { Response } from './types'
import { StatusCodes } from '@/features/http'
import { Container } from '@n8n/di'
import UpdateChefUseCase from './use-case'
import middleware from './middleware'

export const UpdateChefRoute = new Hono().patch(
  '/:id',
  AuthMiddleware.middleware,
  middleware,
  async (c) => {
    let response: Response.Success | Response.Error
    let statusCode: StatusCodes

    const id = c.req.param('id')
    const payload = c.req.valid('form')

    const useCase = Container.get(UpdateChefUseCase)

    const result = await useCase.execute(id, payload)

    if (result.isErr) {
      response = result.error
      switch (result.error.code) {
        case 'ERR_CHEF_NOT_FOUND': {
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
