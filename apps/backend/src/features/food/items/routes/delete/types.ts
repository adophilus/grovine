import { schema as apiSchema, type types } from '@grovine/api'

export namespace Request {
  export type Path = { id: string }
}

export namespace Response {
  type Endpoint = '/foods/items/{id}'

  export type Response =
    types.paths[Endpoint]['delete']['responses'][keyof types.paths[Endpoint]['delete']['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'ITEM_DELETED' }>
  export type Error = Exclude<Response, Success>
}
