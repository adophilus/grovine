import type { MiddlewareHandler } from 'hono'
import type { User } from './types'
import { AuthServiceImpl } from './service'
import { StatusCodes } from '../http'
import { Logger } from '../logger'
import type { schema } from '@beta-lyfe/api'

export type Response =
  | schema.components['schemas']['Api.UnauthorizedError']
  | schema.components['schemas']['Api.UserNotVerifiedError']
  | schema.components['schemas']['Api.UnexpectedError']

namespace Middleware {
  export const middleware: MiddlewareHandler<{
    Variables: {
      user: User
    }
  }> = async (c, next) => {
    const authService = new AuthServiceImpl()

    let response: Response

    const authHeader = c.req.header('authorization')
    Logger.info(authHeader)
    if (!authHeader) {
      response = {
        code: 'UNAUTHORIZED_ERROR'
      }
      return c.json(response, StatusCodes.UNAUTHORIZED)
    }

    const [, accessToken] = authHeader.split(' ')
    if (!accessToken) {
      response = {
        code: 'UNAUTHORIZED_ERROR'
      }
      return c.json(response, StatusCodes.UNAUTHORIZED)
    }

    const res = await authService.getUserWithProfile(accessToken)

    if (res.isErr) {
      switch (res.error) {
        case 'USER_NOT_VERIFIED': {
          response = {
            code: 'USER_NOT_VERIFIED'
          }
          return c.json(response, StatusCodes.UNAUTHORIZED)
        }
        case 'INVALID_OR_EXPIRED_TOKEN': {
          response = {
            code: 'UNAUTHORIZED_ERROR'
          }
          return c.json(response, StatusCodes.UNAUTHORIZED)
        }
        case 'FAILED_TO_FETCH_USER': {
          response = {
            code: 'UNEXPECTED_ERROR'
          }
          return c.json(response, StatusCodes.INTERNAL_SERVER_ERROR)
        }
      }
    }

    const user = res.value

    if (!user) {
      response = {
        code: 'UNAUTHORIZED_ERROR'
      }
      return c.json(response, StatusCodes.UNAUTHORIZED)
    }

    c.set('user', user)

    await next()
  }
}

export default Middleware
