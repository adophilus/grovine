import { z } from 'zod'
import { schema as apiSchema, type types } from '@grovine/api'

export namespace Request {
  export const path = z.object({ id: z.string() })
  export type Path = z.infer<typeof path>
  export const body = apiSchema.schemas.Api_Dev_Users_UpdateRole_Request_Body
  export type Body = z.infer<typeof body>
}

export namespace Response {
  type Endpoint = '/dev/users/{id}'

  export type Response =
    types.paths[Endpoint]['patch']['responses'][keyof types.paths[Endpoint]['patch']['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'USER_ROLE_UPDATED' }>
  export type Error = Exclude<Response, Success>
}
