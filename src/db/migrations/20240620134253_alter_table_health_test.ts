import type { Knex } from 'knex'

const __table__ = 'health_test'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable(__table__, (table) => table.string('action'))
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(__table__, (table) => table.dropColumn('action'))
}
