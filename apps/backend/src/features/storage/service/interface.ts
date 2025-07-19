import type { Result, Unit } from 'true-myth'

export type StorageServiceError = 'UPLOAD_FAILED' | 'REMOVE_FAILED'

export type UploadedData = {
  public_id: string
  url: string
}

abstract class StorageService {
  public abstract upload(
    file: File
  ): Promise<Result<UploadedData, StorageServiceError>>
  public abstract upload(
    file: File[]
  ): Promise<Result<UploadedData[], StorageServiceError>>
  public abstract remove(
    fileId: string
  ): Promise<Result<Unit, StorageServiceError>>
}

export default StorageService
