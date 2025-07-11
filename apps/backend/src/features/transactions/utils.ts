import type { Transaction } from "@/types";

export const serializeTransaction = (tx: Transaction.Selectable) => ({
	...tx,
	amount: Number.parseFloat(tx.amount),
});
