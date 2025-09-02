import { z } from 'zod'
import { schema as apiSchema, type types } from '@grovine/api'

export namespace Request {
  export const body = apiSchema.schemas.Api_Dev_Users_MakeAdmin_Request_Body
  export type Body = z.infer<typeof body>
}

export namespace Response {
  type Endpoint = '/dev/users'

  export type Response =
    types.paths[Endpoint]['post']['responses'][keyof types.paths[Endpoint]['post']['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'USER_ROLE_UPDATED' }>
  export type Error = Exclude<Response, Success>
}
