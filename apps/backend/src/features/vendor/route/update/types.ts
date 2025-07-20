import { z } from 'zod'
import { Vendor } from '@/features/vendor/types'

export namespace Request {
  export const body = Vendor.pick({ name: true, niches: true, profile_picture: true }).partial()
  export type Body = z.infer<typeof body>
}

export namespace Response {
  export type Success = {
    code: 'VENDOR_ACCOUNT_UPDATED'
    data: z.infer<typeof Vendor>
  }

  export type Error = {
    code: 'ERR_UNEXPECTED' | 'VENDOR_ACCOUNT_NOT_FOUND'
  }
}
