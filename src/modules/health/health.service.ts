require('dotenv').config()
import { injectable } from 'tsyringe'

import { HealthTestRepository } from '@app/repositories'

import { ServiceResponse } from '@app/shared/types/http'
import { HealthTestDto } from '@app/shared/types/dtos/health.dto'

/**
 * NOTE::: This is not an actual endpoint or anything, just wrote it to test the ci/cd pipeline
 */
@injectable()
export class MockHealthTestService {
	constructor(private readonly healthTestRepository: HealthTestRepository) {}

	public async testCiCdPipelineCodeUpdate(payload: HealthTestDto): Promise<ServiceResponse> {
		try {
			await this.healthTestRepository.create(payload)

			return { status: true, message: 'Action successful!' }
		} catch (error) {
			return { status: false, message: 'An error occurred seeding mock health test' }
		}
	}
}
