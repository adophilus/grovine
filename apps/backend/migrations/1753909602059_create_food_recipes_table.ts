import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('food_recipes')
    .addColumn('id', 'varchar', (col) => col.primaryKey().notNull())
    .addColumn('title', 'varchar', (col) => col.notNull())
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('ingredients', 'jsonb', (col) => col.notNull())
    .addColumn('instructions', 'jsonb', (col) => col.notNull())
    .addColumn('video', 'jsonb', (col) => col.notNull())
    .addColumn('cover_image', 'jsonb', (col) => col.notNull())
    .addColumn('chef_id', 'varchar', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`NOW()`).notNull()
    )
    .addColumn('updated_at', 'timestamptz')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('food_recipes').execute()
}
