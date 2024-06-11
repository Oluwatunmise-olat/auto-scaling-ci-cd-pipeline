import { UserModelType } from '@app/models'

export type AccountCreationDto = Pick<UserModelType, 'full_name' | 'password' | 'email' | 'phone'>

export type AccountLoginDto = Pick<UserModelType, 'password' | 'email'>
