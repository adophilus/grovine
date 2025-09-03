import { Container } from '@n8n/di'
import { Hono } from 'hono'
import { StatusCodes } from '@/features/http'
import middleware from './middleware'
import type { Response } from './types'
import ResendSignInVerificationEmailUseCase from './use-case'

const ResendSignInVerificationEmailRoute = new Hono().post(
  '/',
  middleware,
  async (c) => {
    let response: Response.Response
    let statusCode: StatusCodes

    const payload = c.req.valid('json')

    const useCase = Container.get(ResendSignInVerificationEmailUseCase)
    const result = await useCase.execute(payload)

    if (result.isErr) {
      switch (result.error.code) {
        case 'ERR_TOKEN_NOT_EXPIRED': {
          response = result.error
          statusCode = StatusCodes.CONFLICT
          break
        }
        case 'ERR_USER_ALREADY_VERIFIED': {
          response = result.error
          statusCode = StatusCodes.BAD_REQUEST
          break
        }
        case 'ERR_USER_NOT_FOUND': {
          response = result.error
          statusCode = StatusCodes.NOT_FOUND
          break
        }
        case 'ERR_VERIFICATION_EMAIL_ALREADY_SENT': {
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

export default ResendSignInVerificationEmailRoute
