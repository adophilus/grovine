import { Pagination } from '@/features/pagination'
import type { types } from '@grovine/api'

export namespace Request {
  export const query = Pagination.schema

  export type Query = Pagination.Schema
}

export namespace Response {
  type Endpoint = '/foods/items'

  export type Response =
    types.paths[Endpoint]['get']['responses'][keyof types.paths[Endpoint]['get']['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'LIST' }>
  export type Error = Exclude<Response, Success>
}
