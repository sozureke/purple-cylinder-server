import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { CartModule } from './cart/cart.module'
import { CategoryModule } from './category/category.module'
import { getMongoConfig } from './config/mongo.config'

import { FavoriteModule } from './favorite/favorite.module'
import { FileModule } from './file/file.module'
import { ProductModule } from './product/product.module'
import { UserModule } from './user/user.module'
import { NewsletterController } from './newsletter/newsletter.controller';
import { NewsletterModule } from './newsletter/newsletter.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypegooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongoConfig
		}),
		AuthModule,
		UserModule,
		CategoryModule,
		FileModule,
		ProductModule,
		CartModule,
		FavoriteModule,
		NewsletterModule
	],
	controllers: [AppController, NewsletterController],
	providers: [AppService]
})
export class AppModule {}
