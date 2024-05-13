import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { NewsletterDto } from './newsletter.dto'
import { NewsletterModel } from './newsletter.model'

@Injectable()
export class NewsletterService {
	constructor(
		@InjectModel(NewsletterModel)
		private readonly NewsletterModel: ModelType<NewsletterModel>
	) {}

	async subscribeSubscriber(
		subscriber_email: string
	): Promise<NewsletterModel> {
		const existingSubscriber = await this.NewsletterModel.findOne({
			email: subscriber_email
		})
		if (existingSubscriber && existingSubscriber.isSubscribed === true) {
			throw new Error('Subscriber already subscribed')
		}
		const defaultValue: NewsletterDto = {
			subscriber_email: subscriber_email,
			isSubscribed: true
		}

		const subscription = await this.NewsletterModel.create(defaultValue)
		return subscription
	}

	async unsubscribeUser(subscriber_email: string): Promise<NewsletterModel> {
		const existingSubscriber = await this.NewsletterModel.findOne({
			email: subscriber_email
		})

		if (!existingSubscriber) {
			throw new NotFoundException('Subscriber not found')
		}

		if (!existingSubscriber.isSubscribed) {
			throw new NotFoundException('Subscriber already unsubscribed')
		}

		existingSubscriber.isSubscribed = false
		await existingSubscriber.save()
		return existingSubscriber
	}
}
