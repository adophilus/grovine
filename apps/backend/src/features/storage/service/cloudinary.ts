import { parseUrl, type UrlScheme } from '@grovine/media-server'
import { Result, type Unit } from 'true-myth'
import z from 'zod'
import { StatusCodes } from '@/features/http'
import type StorageService from './interface'
import type { StorageServiceError, UploadedData } from './interface'

class CloudinaryStorageService implements StorageService {
  private declare urlScheme: UrlScheme

  private uploadJsonResponseSchema = z.object({
    secure_url: z.string().url(),
    public_id: z.string()
  })

  constructor(url: string) {
    this.urlScheme = parseUrl(url)
  }

  public upload(file: File): Promise<Result<UploadedData, StorageServiceError>>
  public upload(
    file: File[]
  ): Promise<Result<UploadedData[], StorageServiceError>>
  public async upload(
    file: unknown
  ): Promise<Result<UploadedData | UploadedData[], StorageServiceError>> {
    const files = Array.isArray(file) ? file : [file]

    const uploadedImageData: UploadedData[] = []

    for (const file of files) {
      const formData = new FormData()

      // formData.set('upload_preset', config.mediaServer.uploadPreset)
      const timestamp = new Date().toString()
      const signature = await this.hash(`timestamp=${timestamp}`)

      formData.set('signature', signature)
      formData.set('signature_algorithm', 'sha256')
      formData.set('timestamp', timestamp)
      formData.append('file', file)
      if (this.urlScheme.apiKey) formData.set('api_key', this.urlScheme.apiKey)
      if (this.urlScheme.folder)
        formData.set('asset_folder', this.urlScheme.folder)

      formData.append('file', file)

      const url = new URL(this.urlScheme.serverUrl)
      url.pathname = `/v1_1/${this.urlScheme.cloudName}/image/upload`

      const res = await fetch(url, {
        method: 'POST',
        body: formData
      })

      if (res.status !== 200) return Result.err('UPLOAD_FAILED')

      const json = this.uploadJsonResponseSchema.parse(await res.json())

      uploadedImageData.push({
        public_id: json.public_id,
        url: json.secure_url
      })
    }

    const returnValue: Result<
      UploadedData[] | UploadedData,
      StorageServiceError
    > = Array.isArray(file)
      ? Result.ok(uploadedImageData)
      : Result.ok(uploadedImageData[0])

    return returnValue
  }

  async remove(fileId: string): Promise<Result<Unit, StorageServiceError>> {
    const deleteResponse = await fetch(
      `${this.urlScheme.serverUrl}/v1_1/image/destroy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          public_id: fileId,
          signature: this.hash(
            `timestamp=${Date.now()}&api_key=${this.urlScheme.apiKey}`
          )
        })
      }
    )

    const res: Result<Unit, StorageServiceError> =
      deleteResponse.status === StatusCodes.OK
        ? Result.ok()
        : Result.err('REMOVE_FAILED')

    return res
  }

  private async hash(payload: string) {
    const msgUint8 = new TextEncoder().encode(payload)
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    return hashHex
  }
}

export default CloudinaryStorageService
