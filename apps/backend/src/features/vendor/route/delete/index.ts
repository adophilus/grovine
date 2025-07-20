import AuthMiddleware from '@/features/auth/middleware'
import { Hono } from 'hono'
import type { Response } from './types'
import { StatusCodes } from '@/features/http'
import { Container } from '@n8n/di'
import DeleteVendorUseCase from './use-case'

export const DeleteVendorRoute = new Hono().delete(
  '/',
  AuthMiddleware.middleware,
  async (c) => {
    let response: Response.Success | Response.Error
    let statusCode: StatusCodes

    const { id: user_id } = c.get('user')

    const useCase = Container.get(DeleteVendorUseCase)

    const result = await useCase.execute(user_id)

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
