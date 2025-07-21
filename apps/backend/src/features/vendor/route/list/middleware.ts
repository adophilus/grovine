import { zValidator } from '@hono/zod-validator'
import { Request } from './types'

const middleware = zValidator('param', Request.)

export default middleware
