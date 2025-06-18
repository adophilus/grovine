import { Hono } from 'hono'
import type { Response } from './types'
import service from './service' // I think this error should gowhe the service is implemented
import { StatusCodes } from '@/features/http'
import { AuthMiddleware } from '@/features/auth'

export default new Hono().get('/', AuthMiddleware.middleware, async (c) =>{
    const user = c.get('user')
    const result = await service(user)

    let response: Response.Response
    let statusCode: StatusCodes

    if(result.isErr){
        switch(result.error.code){
            case 'ERR_WALLET_NOT_FOUND': {
                response = result.error
                statusCode = StatusCodes.NOT_FOUND
                break
            }
            default: {
                response = result.error
                statusCode = StatusCodes.INTERNAL_SERVER_ERROR
                break
            }
        }
    } else {
        response = result.value
        statusCode = StatusCodes.OK
    }
    return c.json(response, statusCode)
})