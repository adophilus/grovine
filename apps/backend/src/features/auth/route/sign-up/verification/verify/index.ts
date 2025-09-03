import { Container } from '@n8n/di'
import { Hono } from 'hono'
import { StatusCodes } from '@/features/http'
import middleware from './middleware'
import type { Response } from './types'
import VerifySignUpVerificationEmailUseCase from './use-case'

const VerifySignUpVerificationEmailRoute = new Hono().post(
  '/',
  middleware,
  async (c) => {
    let response: Response.Response
    let _statusCode: StatusCodes

    const payload = c.req.valid('json')

    const useCase = Container.get(VerifySignUpVerificationEmailUseCase)
    const result = await useCase.execute(payload)

    if (result.isErr) {
      switch (result.error.code) {
        case 'ERR_INVALID_OR_EXPIRED_TOKEN': {
          response = result.error
          _statusCode = StatusCodes.BAD_REQUEST
          break
        }
        default: {
          response = result.error
          _statusCode = StatusCodes.INTERNAL_SERVER_ERROR
          break
        }
      }
    } else {
      response = result.value
      _statusCode = StatusCodes.OK
    }

    return c.json(response)
  }
)

export default VerifySignUpVerificationEmailRoute
