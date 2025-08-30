
import { z } from 'zod'
import type { types } from '@grovine/api'

export namespace Request {
  export const path = z.object({
    id: z.string()
  })
  export type Path = z.infer<typeof path>
}

export namespace Response {
  type Endpoint = '/chefs/{id}/dislike'
  type Method = 'put'

  export type Response =
    types.paths[Endpoint][Method]['responses'][keyof types.paths[Endpoint][Method]['responses']]['content']['application/json']
  export type Success = Extract<Response, { code: 'CHEF_PROFILE_DISLIKED' }>
  export type Error = Exclude<Response, Success>
}
