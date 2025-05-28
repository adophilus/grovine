import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  otp: z.string()
})

export type Schema = z.infer<typeof schema>
export default schema
