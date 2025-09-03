import { Container } from '@n8n/di'
import { Hono } from 'hono'
import { StatusCodes } from '@/features/http'
import middleware from './middleware'
import type { Response } from './types'
import VerifySignInVerificationEmailUseCase from './use-case'

const VerifySignInVerificationEmailRoute = new Hono().post(
  '/',
  middleware,
  async (c) => {
    let response: Response.Response
    let statusCode: StatusCodes

    const payload = c.req.valid('json')

    const useCase = Container.get(VerifySignInVerificationEmailUseCase)
    const result = await useCase.execute(payload)

    if (result.isErr) {
      switch (result.error.code) {
        case 'ERR_INVALID_OR_EXPIRED_OTP': {
          response = result.error
          statusCode = StatusCodes.BAD_REQUEST
          break
        }
        default: {
          response = result.error
          statusCode = StatusCodes.INTERNAL_SERVER_ERROR
        }
      }
    } else {
      response = result.value
      statusCode = StatusCodes.OK
    }

    return c.json(response, statusCode)
  }
)

export default VerifySignInVerificationEmailRoute
