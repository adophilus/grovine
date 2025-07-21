import { schema as apiSchema, type types } from '@grovine/api'
import type { z } from 'zod'

export namespace Request {
  export const body = apiSchema.schemas.Api_Vendor_Create_Request_Body
  export type Body = z.infer<typeof body>
}

export namespace Response {
  type Endpoint = '/vendors'

  export type Response =
    types.paths[Endpoint]['post']['responses'][keyof types.paths[Endpoint]['post']['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'VENDOR_PROFILE_CREATED' }>
  export type Error = Exclude<Response, Success>
}
