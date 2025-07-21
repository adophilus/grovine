import AuthMiddleware from '@/features/auth/middleware'
import { Hono } from 'hono'
import type { Response } from './types'
import { StatusCodes } from '@/features/http'
import { Container } from '@n8n/di'
import UpdateVendorUseCase from './use-case'
import middleware from './middleware'

export const UpdateVendorRoute = new Hono().patch(
  '/:id',
  AuthMiddleware.middleware,
  middleware,
  async (c) => {
    let response: Response.Success | Response.Error
    let statusCode: StatusCodes

    const id = c.req.param('id')
    const payload = c.req.valid('form')

    const useCase = Container.get(UpdateVendorUseCase)

    const result = await useCase.execute(id, payload)

    if (result.isErr) {
      response = result.error
      switch (result.error.code) {
        case 'ERR_VENDOR_NOT_FOUND': {
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
