import { schema as apiSchema, type types } from '@grovine/api'
import type { z } from 'zod'

export namespace Request {
  export const body = apiSchema.schemas.Api_Wallet_Topup_Request_Body
  export type Body = z.infer<typeof body>
}

export namespace Response {
  type Endpoint = '/wallets/topup'

  export type Response =
    types.paths[Endpoint]['post']['responses'][keyof types.paths[Endpoint]['post']['responses']]['content']['application/json']

  export type Success = Extract<
    Response,
    { code: 'WALLET_TOPUP_REQUEST_SUCCESSFUL' }
  >
  export type Error = Exclude<Response, Success>
}
