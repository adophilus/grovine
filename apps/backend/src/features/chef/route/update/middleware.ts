import { zValidator } from '@hono/zod-validator'
import { Request } from './types'

const middleware = zValidator('form', Request.body)

export default middleware
