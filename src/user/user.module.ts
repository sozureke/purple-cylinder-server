import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'
import { CartModule } from 'src/cart/cart.module'
import { UserController } from './user.controller'
import { UserModel } from './user.model'
import { UserService } from './user.service'

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: UserModel,
				schemaOptions: {
					collection: 'User'
				}
			}
		]),
		CartModule,
		ConfigModule
	],
	controllers: [UserController],
	providers: [UserService],
	exports: [TypegooseModule.forFeature([UserModel]), UserService]
})
export class UserModule {}
