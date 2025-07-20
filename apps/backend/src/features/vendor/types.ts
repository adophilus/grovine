import { z } from 'zod'
import type { Generated, Insertable, Selectable, Updateable } from 'kysely'

export const Niches = z.array(z.string().min(1)).min(1)

export const Vendor = z.object({
  user_id: z.string(),
  name: z.string(),
  niches: Niches,
  profile_picture: z.string().nullable(),
  rating: z.number().min(0).max(5).nullable(),
  is_verified: z.boolean().nullable(),
  is_banned: z.boolean().nullable(),
  created_at: z.date().nullable(),
  updated_at: z.date().nullable()
})

export interface VendorTable {
  user_id: string
  name: string
  niches: Json
  profile_picture: string | null
  rating: number | null
  is_verified: boolean | null
  is_banned: boolean | null
  created_at: Generated<Date>
  updated_at: Date | null
}

export type Json = {
  [key: string]: Json | string | number | boolean | null
} | Json[] | string | number | boolean | null

export type SelectableVendor = Selectable<VendorTable>
export type InsertableVendor = Insertable<VendorTable>
export type UpdateableVendor = Updateable<VendorTable>
