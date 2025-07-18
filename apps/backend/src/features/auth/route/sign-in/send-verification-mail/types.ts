import type { z } from 'zod'
import { schema as apiSchema, type types } from '@grovine/api'

export namespace Request {
  export const body =
    apiSchema.schemas.Api_Authentication_SignIn_SignIn_Request_Body

  export type Body = z.infer<typeof body>
}

export namespace Response {
  type Endpoint = '/auth/sign-in'

  export type Response =
    types.paths[Endpoint]['post']['responses'][keyof types.paths[Endpoint]['post']['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'VERIFICATION_EMAIL_SENT' }>
  export type Error = Exclude<Response, Success>
}
