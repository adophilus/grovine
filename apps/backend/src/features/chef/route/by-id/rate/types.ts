
import { z } from 'zod'
import type { types } from '@grovine/api'

export namespace Request {
  export const path = z.object({
    id: z.string()
  })
  export type Path = z.infer<typeof path>

  export const body = z.object({
    rating: z.number().min(1).max(5)
  })
  export type Body = z.infer<typeof body>
}

export namespace Response {
  type Endpoint = '/chefs/{id}/rate'
  type Method = 'put'

  export type Response =
    types.paths[Endpoint][Method]['responses'][keyof types.paths[Endpoint][Method]['responses']]['content']['application/json']
  export type Success = Extract<Response, { code: 'CHEF_PROFILE_RATED' }>
  export type Error = Exclude<Response, Success>
}
