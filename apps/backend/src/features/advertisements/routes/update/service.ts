import Repository from '../../repository'
import type { Request, Response } from './types'
import { Result } from 'true-myth'
import { Storage } from '@/features/storage'
import type { UploadedData } from '@/features/storage/types'

export default async (
  id: string,
  payload: Request.Body
): Promise<Result<Response.Success, Response.Error>> => {
  const findAdvertResult = await Repository.findAdvertById(id)

  if (findAdvertResult.isErr) {
    return Result.err({ code: 'ERR_UNEXPECTED' })
  }

  if (!findAdvertResult.value) {
    return Result.err({ code: 'ERR_ADVERTISEMENT_NOT_FOUND' })
  }

  const { image, ..._payload } = payload

  let updatedImage: UploadedData | undefined = undefined

  if (image) {
    const uploadImageResult = await Storage.service.upload(image)

    if (uploadImageResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    updatedImage = uploadImageResult.value
  }

  const updatePayload = {
    ..._payload,
    image: updatedImage
  }

  const updateAdvertResult = await Repository.updateAdvertById(id, updatePayload)

  if (updateAdvertResult.isErr) {
    return Result.err({ code: 'ERR_UNEXPECTED' })
  }

  const updatedAdvert = updateAdvertResult.value

  return Result.ok({
    code: 'ADVERTISEMENT_UPDATED',
  })
}
