import { Body, Controller, HttpCode, Post, Put } from '@nestjs/common'
import { NewsletterService } from './newsletter.service'

@Controller('newsletter')
export class NewsletterController {
	constructor(private readonly NewsletterService: NewsletterService) {}

	@Post()
	@HttpCode(200)
	async subscribeSubscriber(
		@Body('user_email')
		user_email: string
	): Promise<{ user_email: string; message: string }> {
		await this.NewsletterService.subscribeSubscriber(user_email)
		return { user_email, message: 'Subscribed successfully' }
	}

	@Put()
	@HttpCode(200)
	async unsubscribeSubscriber(
		user_email: string
	): Promise<{ user_email: string; message: string }> {
		await this.NewsletterService.unsubscribeUser(user_email)
		return { user_email, message: 'Unsubscribed successfully' }
	}
}
