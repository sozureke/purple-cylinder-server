import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { ProductDto } from './product.dto'
import { ProductStatus } from './product.enum'
import { ProductModel } from './product.model'

@Injectable()
export class ProductService {
	constructor(
		@InjectModel(ProductModel)
		private readonly ProductModel: ModelType<ProductModel>
	) {}

	async bySlug(slug: string) {
		const product = await this.ProductModel.findOne({ slug })
			.populate('category')
			.exec()
		if (!product) throw new NotFoundException('Product not found')
		return product
	}

	async byId(_id: string) {
		const product = await this.ProductModel.findById(_id)
		if (!product) throw new NotFoundException('Product not found')

		return product
	}

	async byCategory(categoriesId: Types.ObjectId[]) {
		const product = await this.ProductModel.find({
			category: { $in: categoriesId }
		}).exec()
		if (!product) throw new NotFoundException('Products not found')
		return product
	}

	async getAllProducts(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{
						name: new RegExp(searchTerm, 'i')
					}
				]
			}
		}
		return this.ProductModel.find(options)
			.select('-updatedAt -__v')
			.sort({
				createdAt: 'desc'
			})
			.populate('category')
			.exec()
	}

	async updateProduct(_id: string, dto: ProductDto) {
		const updatedProduct = await this.ProductModel.findByIdAndUpdate(_id, dto, {
			new: true
		}).exec()

		if (!updatedProduct) throw new NotFoundException('Product not found')

		return updatedProduct
	}

	async deleteProduct(_id: string) {
		const deleteProduct = this.ProductModel.findByIdAndDelete(_id).exec()

		if (!deleteProduct) throw new NotFoundException('Product not found')

		return deleteProduct
	}

	async createProduct() {
		const defaultValue: ProductDto = {
			name: '',
			description: '',
			slug: '',
			images: [],
			parameters: {
				price: 0,
				sizes: [],
				colors: [],
				status: ProductStatus.available
			},
			category: []
		}
		const product = await this.ProductModel.create(defaultValue)
		return product._id
	}
}
