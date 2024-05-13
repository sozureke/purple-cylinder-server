import { Ref, prop } from '@typegoose/typegoose'
import { Base } from '@typegoose/typegoose/lib/defaultClasses'
import { ProductModel } from 'src/product/product.model'
import { UserModel } from 'src/user/user.model'

export interface CartModel extends Base {}

export class CartItem {
	@prop({ ref: () => ProductModel })
	product: Ref<ProductModel>

	@prop({ default: 1 })
	quantity: number
}

export class CartModel {
	@prop({ ref: () => UserModel })
	user: Ref<UserModel>

	@prop({ default: [] })
	items: CartItem[]

	@prop({ default: 0 })
	totalPrice: number
}
