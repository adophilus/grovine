import { schema, type types } from '@grovine/api'
import type { z } from 'zod'

export namespace Request {
  export const body = schema.schemas.Api_Onboarding_Preferences_Request_Body

  export type Body = z.infer<typeof body>
}

export namespace Response {
  type Endpoint = '/onboarding/preferences'

  export type Response =
    types.paths[Endpoint]['post']['responses'][keyof types.paths[Endpoint]['post']['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'PREFERENCES_SET' }>

  export type Error = Exclude<Response, Success>
}
