import { schema as apiSchema, type types } from '@grovine/api'
import type { z } from 'zod'

export namespace Request {
  export const body = apiSchema.schemas.Api_Chef_Create_Request_Body
  export type Body = z.infer<typeof body>
}

export namespace Response {
  type Endpoint = '/chefs'

  export type Response =
    types.paths[Endpoint]['post']['responses'][keyof types.paths[Endpoint]['post']['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'CHEF_PROFILE_CREATED' }>
  export type Error = Exclude<Response, Success>
}
