import type { types } from '@grovine/api'

export namespace Request {}

export namespace Response {
  type Endpoint = '/auth/profile'

  export type Response =
    types.paths[Endpoint]['get']['responses'][keyof types.paths[Endpoint]['get']['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'USER_PROFILE' }>
  export type Error = Exclude<Response, Success>
}
