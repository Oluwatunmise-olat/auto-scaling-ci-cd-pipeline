import { ModelObject } from 'objection'
import { BaseModel } from './_base.model'

export class HealthTest extends BaseModel {
	static tableName = 'health_test'

	action: string
}

export type HealthTestModelType = ModelObject<HealthTest>
