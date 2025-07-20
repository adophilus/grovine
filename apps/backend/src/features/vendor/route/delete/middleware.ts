import { createValidator } from '@/features/http/zod-validator'
import { z } from 'zod'

const schema = z.object({
  user_id: z.string().uuid()
})

export default createValidator('param', schema)
