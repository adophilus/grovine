import { Hono } from 'hono'
import { StatusCodes } from '@/features/http'
import middleware from './middleware'
import type { Response } from './types'
import { Container } from '@n8n/di'
import SendSignUpVerificationEmailUseCase from './use-case'

const SendSignUpVerificationEmailRoute = new Hono().post(
  '/',
  middleware,
  async (c) => {
    let response: Response.Response
    let statusCode: StatusCodes

    const payload = c.req.valid('json')

    const useCase = Container.get(SendSignUpVerificationEmailUseCase)
    const result = await useCase.execute(payload)

    if (result.isErr) {
      switch (result.error.code) {
        case 'ERR_EMAIL_ALREADY_IN_USE': {
          response = result.error
          statusCode = StatusCodes.CONFLICT
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

export default SendSignUpVerificationEmailRoute
