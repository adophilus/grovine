import { db } from "@/features/database";
import type { Wallet } from "@/types";
import { Result } from "true-myth";
import { sql } from "kysely";

namespace Repository {
    export type Error = "ERR_UNEXPECTED";

    export type CreateWalletPayload = Wallet.Insertable;
    export type FindWalletByIdPayload = { user_id: string };

    export const findWalletByUserId = async (
        payload: FindWalletByIdPayload,
    ): Promise<Result<Wallet.Selectable | null, Error>> => {
        try {
            const wallet = await db
                .selectFrom("wallets")
                .selectAll()
                .where("user_id", "=", payload.user_id)
                .executeTakeFirst();
            return Result.ok(wallet ?? null);
        } catch (err) {
            console.error("failed to find wallet by user id:", err);
            return Result.err("ERR_UNEXPECTED");
        }
    };

    export const topupWalletByUserId = async (
        userId: string,
        amount: number,
    ): Promise<Result<Wallet.Selectable, Error>> => {
        try {
            const wallet = await db
                .updateTable("wallets")
                .set({ balance: sql`balance + ${amount}` })
                .where("user_id", "=", userId)
                .returningAll()
                .executeTakeFirstOrThrow();
            return Result.ok(wallet);
        } catch (err) {
            console.error("failed to top up wallet:", err);
            return Result.err("ERR_UNEXPECTED");
        }
    }

    export const withdrawFromWalletByUserId = async (
        user_id: string,
        amount: number,
    ): Promise<Result<Wallet.Selectable, Error>> => {
        try {
            const wallet = await db
                .updateTable("wallets")
                .set({ balance: sql`balance - ${amount}` })
                .where("user_id", "=", user_id)
                .where("balance", ">=", sql`${amount}`)// I can't tell why this isn't working
                .where("balance", ">", 0)
                .returningAll()
                .executeTakeFirstOrThrow();
            return Result.ok(wallet);
        } catch (err) {
            console.error("failed to withdraw from wallet:", err);
            return Result.err("ERR_UNEXPECTED");
        }
    }
}
export default Repository;