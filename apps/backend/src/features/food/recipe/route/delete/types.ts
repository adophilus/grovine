import type { types } from '@grovine/api'
import { z } from 'zod'

export namespace Request {
  export const params = z.object({
    id: z.string().ulid()
  })

  export type Params = z.infer<typeof params>
}

export namespace Response {
  type Endpoint = '/foods/recipes/{id}'
  type Method = 'delete'

  export type Response =
    types.paths[Endpoint][Method]['responses'][keyof types.paths[Endpoint][Method]['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'RECIPE_DELETED' }>
  export type Error = Exclude<Response, Success>
}
