import { db } from '@/features/database'
import type { Transactions } from '@/types'
import { Result, Unit } from 'true-myth'
import type { Pagination } from '@/features/pagination'

namespace Repository{
    export type Error = 'ERR_UNEXPECTED'
    export type GetTransactionsPayload = Pagination.Options
    export const getTransactions = async(
        payload: GetTransactionsPayload
    ):Promise<Result<Transactions.Selectable[], Error>> => {
        try{
            const transactions = await db
                .selectFrom('transactions')
                .selectAll()
                .limit(payload.per_page)
                .offset(payload.page)
                .execute()
            return Result.ok(transactions)
        }catch(err){
            console.error('failed to get transactions')
            return Result.err('ERR_UNEXPECTED')
        }
    }

    export const getTransactionById = async(
        id: string
    ): Promise<Result<Transactions.Selectable | null, Error>> => {
        try{
            const transaction = await db
                .selectFrom('transactions')
                .selectAll()
                .where('id', '=', id)
                .executeTakeFirst()
            return Result.ok(transaction ?? null)
        }catch(err){
            console.error('failed to get transaction by id:', id, err)
            return Result.err('ERR_UNEXPECTED')
        }
    }
}
export default Repository