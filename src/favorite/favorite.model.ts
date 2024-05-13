import { Ref, prop } from '@typegoose/typegoose'
import { Base } from '@typegoose/typegoose/lib/defaultClasses'
import { ProductModel } from 'src/product/product.model'
import { UserModel } from 'src/user/user.model'

export interface FavoriteModel extends Base {}

export class FavoriteModel {
	@prop({ ref: () => UserModel })
	user: Ref<UserModel>

	@prop({ ref: () => ProductModel, default: [] })
	products: Ref<ProductModel>[]
}
