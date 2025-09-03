import type { types } from '@grovine/api'
import { z } from 'zod'
import { Pagination } from '@/features/pagination'

export namespace Request {
  export const query = Pagination.schema.extend({
    q: z.string().optional()
  })
  export type Query = z.infer<typeof query>
}

export namespace Response {
  type Endpoint = '/foods/search'

  export type Response =
    types.paths[Endpoint]['get']['responses'][keyof types.paths[Endpoint]['get']['responses']]['content']['application/json']

  export type Success = Response
  export type Error = Extract<Response, { code: string }>
}
