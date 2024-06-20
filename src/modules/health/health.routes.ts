import { container } from 'tsyringe'

import { Server } from '@app/shared/types/http'
import { HealthController } from './health.controller'
import validate from '@app/shared/middlewares/validator.middleware'
import { HealthValidationRule } from '@app/shared/validations/health.validation'

const controller = container.resolve(HealthController)

export const healthRoutes = (server: Server, pathPrefix: string) => {
	server.get(`${pathPrefix}/status`, controller.performHealthCheck)

	server.post(
		`${pathPrefix}/cicd-pipeline-deploy-test`,
		validate(HealthValidationRule) as any,
		controller.testCiCdPipelineCodeUpdate,
	)
}
