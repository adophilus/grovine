import type { types } from '@grovine/api'

export namespace Response {
  type Endpoint = '/chefs/profile'

  export type Response =
    types.paths[Endpoint]['get']['responses'][keyof types.paths[Endpoint]['get']['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'CHEF_PROFILE_FOUND' }>
  export type Error = Exclude<Response, Success>
}
