import type { Result } from 'true-myth'
import { type UrlScheme, parseUrl } from '@beta-lyfe/media-server'

export type StorageServiceError = 'UPLOAD_FAILED' | 'REMOVE_FAILED'
export type UploadedData = {
  public_id: string
  url: string
}

export interface StorageService {
  upload(file: File): Promise<Result<UploadedData, StorageServiceError>>
  upload(file: File[]): Promise<Result<UploadedData[], StorageServiceError>>
  remove(fileId: string): Promise<Result<undefined, StorageServiceError>>
}

export class StorageServiceAbstractClass {
  private static parseUrl(url: string) {
    return parseUrl(url)
  }

  protected declare urlScheme: UrlScheme

  constructor(url: string) {
    this.urlScheme = StorageServiceAbstractClass.parseUrl(url)
  }
}
