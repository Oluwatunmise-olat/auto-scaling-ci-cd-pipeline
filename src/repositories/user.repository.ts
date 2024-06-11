import { injectable } from 'tsyringe'

import { User, UserModelType } from '@app/models'
import BaseRepository from './_base.repository'

@injectable()
export class UserRepository extends BaseRepository<UserModelType, User> {
	constructor() {
		super(User)
	}

	public async emailOrPhoneExist(email: string, phone: string) {
		return await this.model
			.query()
			.select('uuid')
			.where('email', email)
			.orWhere('phone', phone)
			.whereNull('deleted_at')
			.first()
	}
}
