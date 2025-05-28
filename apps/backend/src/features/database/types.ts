import type { ColumnType } from "kysely";

type UsersTable = {
	id: string;
	full_name: string;
	email: string;
	phone_number: string;
	referral_code: string | null;
	verified_at: ColumnType<number, never, number>;
	created_at: ColumnType<number, never, never>;
	updated_at: ColumnType<number, never, number>;
};

type TokensTable = {
	id: string;
	token: string;
	purpose: string;
	expires_at: number;
	user_id: string;
	created_at: ColumnType<number, never, never>;
	updated_at: ColumnType<number, never, number>;
};

export type Database = {
	users: UsersTable;
	tokens: TokensTable;
};
