import bcrypt from 'bcrypt'
import { injectable } from 'tsyringe'

@injectable()
export class Encode {
	public async hashPassword(plainTextPassword: string) {
		const salt = await bcrypt.genSalt(10)

		return await bcrypt.hash(plainTextPassword, salt)
	}

	public async verifyPassword(plainTextPassword: string, hashedPassword: string) {
		return await bcrypt.compare(plainTextPassword, hashedPassword)
	}
}
