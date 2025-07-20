import { z } from 'zod'
import { Vendor } from '@/features/vendor/types'

export namespace Response {
  export type Success = {
    code: number
    data: Vendor
    message: string
  }

  export type Error = {
    code: number
    message: string
    issues?: z.ZodIssue[]
  }
}
