import { container } from 'tsyringe'

import { AuthController } from './auth.controller'
import { Server } from '@app/shared/types/http'
import validate from '@app/shared/middlewares/validator.middleware'
import { AccountCreationValidationRule, LoginValidationRule } from '@app/shared/validations/auth.validation'

const controller = container.resolve(AuthController)

export const authRoutes = (server: Server, pathPrefix: string) => {
	server.post(`${pathPrefix}/signup`, validate(AccountCreationValidationRule) as any, controller.signup)

	server.post(`${pathPrefix}/login`, validate(LoginValidationRule) as any, controller.login)
}
