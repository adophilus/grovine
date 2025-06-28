import type { types } from '@grovine/api'
import { z } from 'zod'

export namespace Request {
  export const path = z.object({ id: z.string() })
  export type Path = z.infer<typeof path>
}

export namespace Response {
  type Endpoint = '/foods/orders/{id}'

  export type Response =
    types.paths[Endpoint]['get']['responses'][keyof types.paths[Endpoint]['get']['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'ORDER_FOUND' }>
  export type Error = Exclude<Response, Success>
}
