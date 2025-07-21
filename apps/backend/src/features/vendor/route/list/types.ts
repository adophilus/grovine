import { Pagination } from '@/features/pagination'
import type { types } from '@grovine/api'
import type { z } from 'zod'

export namespace Request {
  export const query = Pagination.schema
  export type Query = z.infer<typeof query>
}

export namespace Response {
  type Endpoint = '/vendors'

  export type Response =
    types.paths[Endpoint]['get']['responses'][keyof types.paths[Endpoint]['get']['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'LIST' }>
  export type Error = Exclude<Response, Success>
}
