import { z } from 'zod'
import { schema as apiSchema, type types } from '@grovine/api'

export namespace Request {
  export const body = apiSchema.schemas.Api_Chef_ById_Update_Request_Body.omit({
    profile_picture: true
  }).extend({
    profile_picture: z.instanceof(File)
  })
  export type Body = z.infer<typeof body>
}

export namespace Response {
  type Endpoint = '/chefs/{id}'

  export type Response =
    types.paths[Endpoint]['patch']['responses'][keyof types.paths[Endpoint]['patch']['responses']]['content']['application/json']
  export type Success = Extract<Response, { code: 'CHEF_UPDATED' }>
  export type Error = Exclude<Response, Success>
}
