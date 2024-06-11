import { injectable } from 'tsyringe'

import { Request, Response } from '@app/shared/types/http'
import { AuthService } from './services/auth.service'
import { AccountCreationDto, AccountLoginDto } from '@app/shared/types/dtos/auth.dto'
import { genericResponse } from '@app/shared/utils/http'

@injectable()
export class AuthController {
	constructor(private readonly service: AuthService) {}

	signup = async (request: Request, response: Response) => {
		const payload = request.body as AccountCreationDto

		const data = await this.service.signup(payload)

		return genericResponse({ response, data })
	}

	login = async (request: Request, response: Response) => {
		const payload = request.body as AccountLoginDto

		const data = await this.service.login(payload)

		return genericResponse({ response, data })
	}
}
