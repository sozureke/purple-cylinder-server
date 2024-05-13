import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'
import { ProductModule } from 'src/product/product.module'
import { UserModule } from 'src/user/user.module'
import { FavoriteController } from './favorite.controller'
import { FavoriteModel } from './favorite.model'
import { FavoriteService } from './favorite.service'

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: FavoriteModel,
				schemaOptions: {
					collection: 'Favorite'
				}
			}
		]),
		UserModule,
		ProductModule,
		ConfigModule
	],
	providers: [FavoriteService],
	controllers: [FavoriteController],
	exports: [TypegooseModule.forFeature([FavoriteModel]), FavoriteService]
})
export class FavoriteModule {}
