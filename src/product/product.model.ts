import { Ref, prop } from '@typegoose/typegoose'
import { Base } from '@typegoose/typegoose/lib/defaultClasses'
import { CategoryModel } from 'src/category/category.model'
import { ProductStatus } from './product.enum'

export interface ProductModel extends Base {}

export class Parameters {
	@prop({ default: 0 })
	price: number

	@prop({ type: () => [String] })
	sizes: string[]

	@prop({ type: () => [String] })
	colors: string[]

	@prop({ enum: ProductStatus, default: ProductStatus.available })
	status: ProductStatus
}

export class ProductModel {
	@prop()
	name: string

	@prop()
	description: string

	@prop({ unique: true })
	slug: string

	@prop({ type: () => [String] })
	images: string[]

	@prop({ _id: false, type: () => Parameters })
	parameters?: Parameters

	@prop({ ref: () => CategoryModel })
	category: Ref<CategoryModel>[]
}
