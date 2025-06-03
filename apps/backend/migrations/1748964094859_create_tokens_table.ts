import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("tokens")
    .addColumn("id", "varchar", (col) => col.primaryKey().notNull())
    .addColumn("token", "varchar", (col) => col.notNull())
    .addColumn("purpose", "varchar", (col) => col.notNull())
    .addColumn("expires_at", "timestamptz", (col) => col.notNull())
    .addColumn("user_id", "varchar", (col) => col.unique())
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`NOW()`).notNull(),
    )
    .addColumn("updated_at", "timestamptz")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("tokens").execute();
}
