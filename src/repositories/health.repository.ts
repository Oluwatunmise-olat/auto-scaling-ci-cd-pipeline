import { injectable } from 'tsyringe'

import { HealthTestModelType, HealthTest } from '@app/models'
import BaseRepository from './_base.repository'

@injectable()
export class HealthTestRepository extends BaseRepository<HealthTestModelType, HealthTest> {
	constructor() {
		super(HealthTest)
	}
}
