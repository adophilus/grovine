import { ulid } from 'ulidx'
import Repository from '../../repository'
import type { Request, Response } from './types'
import { Result } from 'true-myth'
import { Storage } from '@/features/storage'
import { serializeItem } from '../../utils'

export default async (
  payload: Request.Body
): Promise<Result<Response.Success, Response.Error>> => {
  const { image, ..._payload } = payload

  const uploadImageResult = await Storage.service.upload(image)

  if (uploadImageResult.isErr) {
    return Result.err({
      code: 'ERR_UNEXPECTED'
    })
  }

  const uploadedImage = uploadImageResult.value

  const createItemResult = await Repository.createItem({
    ..._payload,
    price: _payload.price.toString(),
    image: uploadedImage,
    id: ulid()
  })

  if (createItemResult.isErr) {
    return Result.err({
      code: 'ERR_UNEXPECTED'
    })
  }

  return Result.ok({
    code: 'ITEM_CREATED',
    data: serializeItem(createItemResult.value)
  })
}
