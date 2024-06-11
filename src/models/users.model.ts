import { ModelObject } from 'objection'
import { BaseModel } from './_base.model'

export class User extends BaseModel {
	static tableName = 'users'

	email: string
	phone: string
	password: string
	full_name: string
	profile_picture?: string
	status: string
	is_account_verified: boolean
}

export type UserModelType = ModelObject<User>
