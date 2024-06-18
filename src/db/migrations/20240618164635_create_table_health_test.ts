import type { Knex } from 'knex'

/**
 * This is a table that does nothing, but to aid in better testing
 */
const __table__ = 'health_test'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable(__table__, (table) => {
		table.string('uuid').primary()
		table.timestamps(true, true)
		table.timestamp('deleted_at').nullable()
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable(__table__)
}
