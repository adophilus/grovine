import { db } from '@/features/database'
import type { Adverts } from '@/types'
import { Result } from 'true-myth'
import type { Pagination } from '@/features/pagination'


namespace Repository {
    export type Error = 'ERR_UNEXPECTED'
    export type GetAdvertsPayload = Pagination.Options
    export const getAdverts = async (
        payload: GetAdvertsPayload
    ): Promise<Result<Adverts.Selectable[], Error>> => {
        try {
            const adverts = await db
                .selectFrom('adverts')
                .selectAll()
                .limit(payload.per_page)
                .offset(payload.page)
                .execute()
            return Result.ok(adverts)
        } catch (err) {
            console.error('failed to get adverts: ', err)
            return Result.err('ERR_UNEXPECTED')
        }
    }

    export const getAdvertById = async (
        id: string
    ): Promise<Result<Adverts.Selectable | null, Error>> => {
        try {
            const advert = await db
                .selectFrom('adverts')
                .selectAll()
                .where('id', '=', id)
                .executeTakeFirst()
            return Result.ok(advert ?? null)
        }catch (err){
            console.error('failed to find the specified advert: ', id, err)
            return Result.err('ERR_UNEXPECTED')
        }
    }
}
export default Repository