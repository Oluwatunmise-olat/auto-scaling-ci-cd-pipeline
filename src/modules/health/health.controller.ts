import { injectable } from 'tsyringe'

import { Response, ServiceResponse } from '@app/shared/types/http'
import { genericResponse } from '@app/shared/utils/http'

@injectable()
export class HealthController {
	performHealthCheck = async (_, response: Response) => {
		const result: ServiceResponse = { status: true, message: 'Service Healthy' }

		return genericResponse({ response, data: result })
	}
}
