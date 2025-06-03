import type { ColumnType } from "kysely";

type TimestampModel = {
	created_at: ColumnType<string, never, never>;
	updated_at: ColumnType<string, never, string>;
};

type UsersTable = TimestampModel & {
	id: string;
	full_name: string;
	email: string;
	phone_number: string;
	referral_code: string | null;
	verified_at: ColumnType<string, never, string>;
};

type TokensTable = TimestampModel & {
	id: string;
	token: string;
	purpose: string;
	expires_at: number;
	user_id: string;
};

export type Database = {
	users: UsersTable;
	tokens: TokensTable;
};
