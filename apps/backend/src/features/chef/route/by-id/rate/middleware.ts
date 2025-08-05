
import { zValidator } from '@hono/zod-validator'
import { Request } from './types'

const middleware = zValidator('json', Request.body)

export default middleware
