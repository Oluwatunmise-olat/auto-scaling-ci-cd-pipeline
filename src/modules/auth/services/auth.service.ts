require('dotenv').config()
import { injectable } from 'tsyringe'

import { UserRepository } from '@app/repositories'

import { AccountCreationDto, AccountLoginDto } from '@app/shared/types/dtos/auth.dto'
import { UserStatusEnum } from '@app/shared/enums/model.enum'
import { Encode } from '@app/shared/utils/encode.util'
import { ServiceResponse } from '@app/shared/types/http'

@injectable()
export class AuthService {
	constructor(private readonly encoder: Encode, private readonly userRepository: UserRepository) {}

	public async signup(payload: AccountCreationDto): Promise<ServiceResponse> {
		try {
			console.log(process.env)

			const userExist = await this.userRepository.emailOrPhoneExist(payload.email, payload.phone)

			if (userExist) return { status: false, message: 'Email Or Phone Number already in use!', data: null }

			payload.password = await this.encoder.hashPassword(payload.password)
			const user = { ...payload, status: UserStatusEnum.ACTIVE, is_account_verified: false }

			await this.userRepository.create(user)

			return { status: true, message: 'Account created successfully!' }
		} catch (error) {
			console.log(error)
			return { status: false, message: 'An error occurred signing up' }
		}
	}

	public async login(payload: AccountLoginDto): Promise<ServiceResponse> {
		try {
			const user = await this.userRepository.findOne({
				payload: { email: payload.email, deleted_at: null },
				columns: ['*' as any],
			})

			if (!user) return { status: false, message: 'Incorrect email or password' }

			const validPassword = await this.encoder.verifyPassword(payload.password, user.password)

			if (!validPassword) return { status: false, message: 'Incorrect email or password' }

			if (!user.is_account_verified) return { status: false, message: 'Please verify your email to proceed' }

			const { password, ...extras } = user

			return { status: true, message: 'Authenticate user', data: { user: extras } }
		} catch (error) {
			console.log(error)
			return { status: false, message: 'An error occurred authenticating user' }
		}
	}
}
