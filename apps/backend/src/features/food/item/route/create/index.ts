import { Container } from '@n8n/di'
import { Hono } from 'hono'
import AuthMiddleware from '@/features/auth/middleware'
import { StatusCodes } from '@/features/http'
import middleware from './middleware'
import type { Response } from './types'
import CreateFoodItemUseCase from './use-case'

const CreateFoodItemRoute = new Hono().post(
  '/',
  AuthMiddleware.middleware,
  middleware,
  async (c) => {
    let response: Response.Response
    let statusCode: StatusCodes

    const payload = c.req.valid('form')
    const user = c.get('user')

    const useCase = Container.get(CreateFoodItemUseCase)
    const result = await useCase.execute(payload, user)

    if (result.isErr) {
      switch (result.error.code) {
        default: {
          response = result.error
          statusCode = StatusCodes.INTERNAL_SERVER_ERROR
          break
        }
      }
    } else {
      response = result.value
      statusCode = StatusCodes.CREATED
    }

    return c.json(response, statusCode)
  }
)

export default CreateFoodItemRoute
