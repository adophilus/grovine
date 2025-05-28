import { Hono } from 'hono'
import type { schema } from '@beta-lyfe/api'
import service from './service'
import { StatusCodes } from 'http-status-codes'
import middleware from './middleware'

export type Response =
  schema.paths['/api/auth/reset-password']['post']['responses'][keyof schema.paths['/api/auth/reset-password']['post']['responses']]['content']['application/json']

export default new Hono().post('/', middleware, async (c) => {
  const payload = c.req.valid('json')

  let response: Response

  const result = await service(payload)
  if (result.isErr) {
    switch (result.error.code) {
      case 'TOKEN_NOT_EXPIRED': {
        response = {
          code: 'PASSWORD_RESET_MAIL_ALREADY_SENT_ERROR',
          data: {
            expires_at: result.error.data.token.expires_at
          }
        }

        return c.json(response, StatusCodes.BAD_REQUEST)
      }
      case 'USER_NOT_FOUND_ERROR': {
        response = {
          code: 'CHECK_EMAIL_FOR_RESET_LINK'
        }

        return c.json(response)
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
    code: 'CHECK_EMAIL_FOR_RESET_LINK'
  }

  return c.json(response)
})
