import { z } from 'zod'
import { Vendor } from '@/features/vendor/types'

export namespace Request {
  export const params = z.object({ user_id: z.string() })
  export type Params = z.infer<typeof params>
}

export namespace Response {
  export type Success = {
    code: 'VENDOR_ACCOUNT_FOUND'
    data: z.infer<typeof Vendor>
  }

  export type Error = {
    code: 'ERR_UNEXPECTED' | 'VENDOR_ACCOUNT_NOT_FOUND'
  }
}
