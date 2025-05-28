import { Hono } from 'hono'
import Middleware from '../../middleware'
import type { paths } from '@beta-lyfe/api/types'

export type Response =
  paths['/api/auth/profile']['get']['responses'][keyof paths['/api/auth/profile']['get']['responses']]['content']['application/json']

export default new Hono().get('/profile', Middleware.middleware, (c) => {
  const user = c.get('user')

  const response: Response = {
    code: 'FETCHED_PROFILE',
    data: user.data
  }

  return c.json(response)
})
