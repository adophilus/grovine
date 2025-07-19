import { zValidator } from '@hono/zod-validator'
import { Request } from './types'

export default zValidator('json', Request.body)
