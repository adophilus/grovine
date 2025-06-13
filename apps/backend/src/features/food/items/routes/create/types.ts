import type { z } from 'zod'
import { schema as apiSchema, type types } from '@grovine/api'

export namespace Request {
  export const body = apiSchema.schemas.Api_Food_Item_Create_Request_Body
  export type Body = z.infer<typeof body>
}

export namespace Response {
  type Endpoint = '/foods/items'

  export type Response =
    types.paths[Endpoint]['post']['responses'][keyof types.paths[Endpoint]['post']['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'ITEM_CREATED' }>
  export type Error = Exclude<Response, Success>
}
