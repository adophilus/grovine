import type { types } from '@grovine/api'

export namespace Response {
  type Endpoint = '/foods/carts'

  export type Response =
    types.paths[Endpoint]['get']['responses'][keyof types.paths[Endpoint]['get']['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'CART_FOUND' }>
  export type Error = Exclude<Response, Success>
}
