import { injectable } from 'tsyringe'

import { Request, Response, ServiceResponse } from '@app/shared/types/http'
import { genericResponse } from '@app/shared/utils/http'
import { MockHealthTestService } from './health.service'
import { HealthTestDto } from '@app/shared/types/dtos/health.dto'

@injectable()
export class HealthController {
	constructor(private readonly healthService: MockHealthTestService) {}

	performHealthCheck = async (_, response: Response) => {
		const result: ServiceResponse = { status: true, message: 'Service Healthy' }

		return genericResponse({ response, data: result })
	}

	/**
	 * NOTE::: This is not an actual endpoint or anything, just wrote it to test the ci/cd pipeline
	 */
	testCiCdPipelineCodeUpdate = async (request: Request, response: Response) => {
		const data = await this.healthService.testCiCdPipelineCodeUpdate(request.body as HealthTestDto)

		return genericResponse({ response, data: data })
	}
}
