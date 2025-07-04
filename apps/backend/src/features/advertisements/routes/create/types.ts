import { z } from 'zod'
import { schema as apiSchema, type types } from '@grovine/api'

export namespace Request{
    export const body = apiSchema.schemas.Api_Order_Advertisement_Create_Request_Body
    export type Body = z.infer<typeof body>
}
export namespace Response{
    type Endpoint = '/ads'

    export type Response = 
        types.paths[Endpoint]['post']['responses'][keyof types.paths[Endpoint]['post']['responses']]['content']['application/json']
    export type Success = Extract<Response, { code: 'ADVERTISEMENT_CREATED'}>
    export type Error = Exclude<Response, Success>
}