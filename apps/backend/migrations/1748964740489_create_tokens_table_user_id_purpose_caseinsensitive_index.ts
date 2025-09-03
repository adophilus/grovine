import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createIndex('user_id_purpose_unique_caseinsensitive_idx')
    .on('tokens')
    .unique()
    .expression(sql`LOWER(user_id), LOWER(purpose)`)
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropIndex('user_id_purpose_unique_caseinsensitive_idx')
    .execute()
}
