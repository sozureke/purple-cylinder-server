import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class NewsletterDto {
	@IsEmail()
	@IsNotEmpty()
	@IsString()
	subscriber_email: string

	isSubscribed: boolean
}
