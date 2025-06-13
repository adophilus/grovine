import type { z } from 'zod'
import { schema as apiSchema, type types } from '@grovine/api'

export namespace Request {
  export const body = apiSchema.schemas.Api_Food_Item_ById_Update_Request_Body
  export type Body = z.infer<typeof body>
  export type Path = { id: string }
}

export namespace Response {
  type Endpoint = '/foods/items/{id}'

  export type Response =
    types.paths[Endpoint]['patch']['responses'][keyof types.paths[Endpoint]['patch']['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'ITEM_UPDATED' }>
  export type Error = Exclude<Response, Success>
}
