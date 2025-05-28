import { zValidator } from '@hono/zod-validator'
import schema from './schema'

export default zValidator('json', schema)
