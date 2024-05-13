import { prop } from '@typegoose/typegoose'
import { Base } from '@typegoose/typegoose/lib/defaultClasses'

export interface NewsletterModel extends Base {}

export class NewsletterModel {
	@prop({ unique: true })
	email: string

	@prop({ default: false })
	isSubscribed: boolean
}
