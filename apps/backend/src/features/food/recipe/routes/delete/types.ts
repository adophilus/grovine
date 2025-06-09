import type { types } from '@grovine/api'

export namespace Response {
  type Endpoint = '/foods/recipes/{id}'

  export type Response =
    types.paths[Endpoint]['delete']['responses'][keyof types.paths[Endpoint]['delete']['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'RECIPE_DELETED' }>
  export type Error = Exclude<Response, Success>
}