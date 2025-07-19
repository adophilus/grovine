import { Result, type Unit } from 'true-myth'
import type StorageService from './interface'
import type { StorageServiceError, UploadedData } from './interface'

class MockStorageService implements StorageService {
  public upload(file: File): Promise<Result<UploadedData, StorageServiceError>>
  public upload(
    file: File[]
  ): Promise<Result<UploadedData[], StorageServiceError>>
  public async upload(
    file: unknown
  ): Promise<Result<UploadedData | UploadedData[], StorageServiceError>> {
    const returnData: UploadedData = {
      public_id: '',
      url: ''
    }
    return Array.isArray(file)
      ? Result.ok(file.map(() => returnData))
      : Result.ok(returnData)
  }

  async remove(_: string): Promise<Result<Unit, StorageServiceError>> {
    return Result.ok()
  }
}

export default MockStorageService
