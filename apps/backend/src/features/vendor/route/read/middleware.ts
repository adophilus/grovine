import { zValidator } from '@hono/zod-validator'
import { Request } from './types'

const middleware = zValidator('param', Request.params)

export default middleware
