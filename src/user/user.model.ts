import { Ref, prop } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { CartModel } from 'src/cart/cart.model'
import { FavoriteModel } from 'src/favorite/favorite.model'

export interface UserModel extends Base {}

export class UserModel extends TimeStamps {
	@prop()
	name: string
	@prop()
	surname: string

	@prop({ unique: true })
	email: string
	@prop()
	password: string

	@prop({ default: false })
	isAdmin?: boolean

	@prop()
	isSubscribed?: boolean

	@prop({ ref: () => CartModel })
	cart?: Ref<CartModel>

	@prop({ ref: () => FavoriteModel })
	favorite?: Ref<FavoriteModel>
}
