import AuthMiddleware from '@/features/auth/middleware'
import { Hono } from 'hono'
import type { Response } from './types'
import { StatusCodes } from '@/features/http'
import { Container } from '@n8n/di'
import UpdateVendorUseCase from './use-case'

export const UpdateVendorRoute = new Hono().patch(
  '/',
  AuthMiddleware.middleware,
  async (c) => {
    let response: Response.Success | Response.Error
    let statusCode: StatusCodes

    const payload = c.req.valid('json')
    const { id: user_id } = c.get('user')

    const useCase = Container.get(UpdateVendorUseCase)

    const result = await useCase.execute(payload, user_id)

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
