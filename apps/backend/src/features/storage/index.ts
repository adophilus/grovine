import { z } from 'zod'
import { config } from '../config'
import { StorageServiceImplementation } from './impl'

export namespace Storage {
  export const service = new StorageServiceImplementation(
    config.storage.mediaServerUrl
  )

  export const schema = {
    file: z.instanceof(File)
  }
}
