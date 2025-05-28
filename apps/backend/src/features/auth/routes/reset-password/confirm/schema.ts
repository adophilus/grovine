import { z } from 'zod'

export const paramSchema = z.object({
  token: z.string().ulid()
})

export const bodySchema = z.object({
  password: z.string()
})

export type Schema = z.infer<typeof paramSchema> & z.infer<typeof bodySchema>
