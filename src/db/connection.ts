import Knex from 'knex'
import { Model } from 'objection'

import knexConfig from '../../knexfile'

export default function init() {
	const knex = Knex(knexConfig)
	Model.knex(knex)

	return knex
}
