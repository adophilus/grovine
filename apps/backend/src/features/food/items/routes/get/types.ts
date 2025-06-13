import type { types } from '@grovine/api'

export namespace Request {
  export type Path = { id: string }
}

export namespace Response {
  type Endpoint = '/foods/items/{id}'

  export type Response =
    types.paths[Endpoint]['get']['responses'][keyof types.paths[Endpoint]['get']['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'ITEM_FOUND' }>
  export type Error = Exclude<Response, Success>
}
