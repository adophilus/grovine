import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('food_items')
    .addColumn('id', 'varchar', (col) => col.primaryKey().notNull())
    .addColumn('name', 'varchar', (col) => col.notNull())
    .addColumn('video_url', 'varchar', (col) => col.notNull())
    .addColumn('price', 'varchar', (col) => col.notNull())
    .addColumn('image', 'jsonb', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`NOW()`).notNull()
    )
    .addColumn('updated_at', 'timestamptz')
    .execute()
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('food_items').execute()
}
