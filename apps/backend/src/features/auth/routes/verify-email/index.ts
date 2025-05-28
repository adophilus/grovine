import { Hono } from 'hono'
import { StatusCodes } from '../../../http'
import service from './service'
import middleware from './middleware'
import type { schema } from '@beta-lyfe/api'

export type Response =
  schema.paths['/api/auth/verify-email']['post']['responses'][keyof schema.paths['/api/auth/verify-email']['post']['responses']]['content']['application/json']

export default new Hono().post('/verify-email', middleware, async (c) => {
  const payload = c.req.valid('json')

  const result = await service(payload)

  let response: Response

  if (result.isErr) {
    switch (result.error) {
      case 'INVALID_OR_EXPIRED_OTP_ERROR': {
        response = {
          code: 'INVALID_OR_EXPIRED_OTP_ERROR'
        }
        return c.json(response, StatusCodes.BAD_REQUEST)
      }
      case 'UNEXPECTED_ERROR': {
        response = {
          code: 'UNEXPECTED_ERROR'
        }
        return c.json(response, StatusCodes.INTERNAL_SERVER_ERROR)
      }
    }
  }

  response = {
    code: 'VERIFICATION_SUCCESSFUL'
  }

  return c.json(response)
})
