import Objection from 'objection'

import { BaseModel } from '@app/models/_base.model'
import { formatDate } from '@app/shared/utils/date'
import { AppDateFormats } from '@app/shared/enums/generic.enum'

export default class BaseRepository<T, M extends BaseModel> {
	protected model: Objection.ModelClass<M>
	public tableName: string

	constructor(model: Objection.ModelClass<M>) {
		this.model = model
		this.tableName = model.tableName
	}

	async create(
		payload: Partial<T>,
		trx?: Objection.Transaction,
	): Promise<Objection.SingleQueryBuilder<Objection.QueryBuilderType<M>>> {
		return await this.model.query(trx).insert(payload)
	}

	async count(query_identifier: Partial<T>, trx?: Objection.Transaction) {
		return this.model.query(trx).where(query_identifier).count('*', { as: 'total' }).first() as any as { total: number }
	}

	async update(query_identifier: Partial<T>, payload: Partial<T>, trx?: Objection.Transaction): Promise<void> {
		await this.model.query(trx).where(query_identifier).update(payload)
	}

	async delete(query_identifier: Partial<T>, soft_delete?: boolean, trx?: Objection.Transaction): Promise<void> {
		if (!soft_delete) {
			await this.model.query(trx).where(query_identifier).delete()
		} else {
			await this.model
				.query(trx)
				.where(query_identifier)
				.update({ deleted_at: formatDate(AppDateFormats.DB) })
		}
	}

	async findOne({
		payload,
		preload = {},
		trx,
		columns = [],
	}: {
		payload: Partial<T>
		preload?: { [key in keyof Partial<T>]: boolean | object } | {}
		columns?: (keyof T)[] | string
		trx?: Objection.Transaction
	}) {
		const preloadKeys = Object.keys(preload)

		let query = this.model
			.query(trx)
			.where(payload)
			.withGraphFetched(preload || {})
			.select([...columns, 'created_at'])

		for (const key of preloadKeys) {
			const referencedTableName = this.model.getRelation(key).relatedModelClass.tableName
			query = query.modifyGraph(key, (queryBuilder) => {
				queryBuilder.whereNull(`${referencedTableName}.deleted_at`)
			})
		}

		return await query.first()
	}

	async find({
		payload,
		trx,
		columns = [],
		preload = {},
	}: {
		payload: Partial<T>
		columns?: (keyof T)[]
		preload?: { [key in keyof Partial<T>]: boolean | object } | {}
		trx?: Objection.Transaction
	}) {
		const preloadKeys = Object.keys(preload)

		let query = this.model
			.query(trx)
			.where(payload)
			.select([...columns!, 'created_at'])
			.withGraphFetched(preload)

		for (const key of preloadKeys) {
			const referencedTableName = this.model.getRelation(key).relatedModelClass.tableName
			query = query.modifyGraph(key, (queryBuilder) => {
				queryBuilder.whereNull(`${referencedTableName}.deleted_at`)
			})
		}

		return await query.orderBy('created_at', 'DESC')
	}
}
