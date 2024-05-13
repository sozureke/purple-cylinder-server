import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'
import { ProductModule } from 'src/product/product.module'
import { CartController } from './cart.controller'
import { CartModel } from './cart.model'
import { CartService } from './cart.service'

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: CartModel,
				schemaOptions: {
					collection: 'Cart'
				}
			}
		]),

		ProductModule,
		ConfigModule
	],
	providers: [CartService],
	controllers: [CartController],
	exports: [TypegooseModule.forFeature([CartModel]), CartService]
})
export class CartModule {}
