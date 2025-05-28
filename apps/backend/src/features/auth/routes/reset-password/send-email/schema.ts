import { z } from 'zod'

const schema = z.object({
  email: z.string().email()
})

export type Schema = z.infer<typeof schema>

export default schema
