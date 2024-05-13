import { IsEmail, IsString, MinLength } from 'class-validator'

export class AuthDto {
	name?: string
	surname?: string

	@IsEmail()
	email: string

	@MinLength(6, { message: 'Password must be at least 6 characters long' })
	@IsString()
	password: string
}
