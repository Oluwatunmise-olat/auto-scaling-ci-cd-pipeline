import Objection from 'objection'
import Knex from 'knex'
import { v4 } from 'uuid'

import { formatDate } from '@app/shared/utils/date'
import { AppDateFormats } from '@app/shared/enums/generic.enum'
import db_config from '../../knexfile'

Objection.Model.knex(Knex(db_config))

export abstract class BaseModel extends Objection.Model {
	uuid: string

	created_at: string

	updated_at: string

	deleted_at?: string | null

	$beforeInsert(): void | Promise<any> {
		const currentDate = formatDate(AppDateFormats.DB)

		if (!this.uuid) this.uuid = v4()
		if (!this.created_at) this.created_at = currentDate
		if (!this.updated_at) this.updated_at = currentDate
	}
}
