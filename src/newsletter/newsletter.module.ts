import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { NewsletterController } from './newsletter.controller'
import { NewsletterModel } from './newsletter.model'
import { NewsletterService } from './newsletter.service'

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: NewsletterModel,
				schemaOptions: {
					collection: 'Newsletter'
				}
			}
		])
	],
	providers: [NewsletterService],
	controllers: [NewsletterController],
	exports: [NewsletterService]
})
export class NewsletterModule {}
