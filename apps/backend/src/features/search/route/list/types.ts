import type { types } from '@grovine/api'

export namespace Request {
  export type Query = types.paths['/search']['get']['parameters']['query']
}

export namespace Response {
  type Endpoint = '/search'

  export type Response =
    types.paths[Endpoint]['get']['responses'][keyof types.paths[Endpoint]['get']['responses']]['content']['application/json']

  export type Success = Response
  export type Error = Extract<Response, { code: string }>
}
