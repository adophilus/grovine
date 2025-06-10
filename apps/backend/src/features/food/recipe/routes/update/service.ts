import Repository from '../../repository'
import type { Request, Response } from './types'
import { Result } from 'true-myth'
import { Storage } from '@/features/storage'

export default async (
  id: string,
  payload: Request.Body
): Promise<Result<Response.Success, Response.Error>> => {
  const { image, ..._payload } = payload

  let updatedPayload = { ..._payload }

  if (image) {
    const uploadImageResult = await Storage.service.upload(image)

    if (uploadImageResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    updatedPayload = {
      ...updatedPayload,
      image: uploadImageResult.value
    }
  }

  const result = await Repository.updateRecipeById(id, updatedPayload)

  if (result.isErr) {
    return Result.err({ code: 'ERR_UNEXPECTED' })
  }

  return Result.ok({
    code: 'RECIPE_UPDATED',
    data: result.value
  })
}

