import { Hono } from 'hono'
import { StatusCodes } from 'http-status-codes'
import fs from 'node:fs/promises'
import { ulid } from 'ulidx'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import path from 'node:path'
import config from './config'

const deleteMiddleware = zValidator(
  'query',
  z.object({
    public_id: z.string()
  })
)

export default new Hono()
  .post('/destroy', deleteMiddleware, async (c) => {
    const { public_id } = c.req.valid('query')

    const filepath = `./public/uploads/${public_id}`

    await fs.unlink(filepath)

    return c.json({
      result: 'ok'
    })
  })
  .post('/upload', async (c) => {
    const body = await c.req.parseBody()
    const maybeFile = body.file

    if (Array.isArray(maybeFile)) return c.json({}, StatusCodes.BAD_REQUEST)

    if (typeof maybeFile === 'string')
      return c.json({}, StatusCodes.BAD_REQUEST)

    const file = maybeFile

    const id = ulid()
    const ext = path.extname(file.name)
    const fullFileName = `${id}${ext}`

    await fs.writeFile(
      `./public/uploads/${fullFileName}`,
      new Uint8Array(await file.arrayBuffer())
    )

    const details = {
      secure_url: `${config.server.url}/public/uploads/${fullFileName}`,
      public_id: fullFileName
    }

    return c.json(details, StatusCodes.OK)
  })
