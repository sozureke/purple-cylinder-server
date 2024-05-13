import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { ProductModel } from 'src/product/product.model'
import { UserModel } from 'src/user/user.model'
import { FavoriteModel } from './favorite.model'

@Injectable()
export class FavoriteService {
	constructor(
		@InjectModel(FavoriteModel)
		private readonly FavoriteModel: ModelType<FavoriteModel>,
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
		@InjectModel(ProductModel)
		private readonly ProductModel: ModelType<ProductModel>
	) {}

	async createFavorite(userId: string): Promise<FavoriteModel> {
		const defaultValue = {
			user: userId,
			products: []
		}

		const favorite = await this.FavoriteModel.create(defaultValue)
		return favorite
	}

	async getFavoriteItems(userId: string) {
		const favorite = await this.FavoriteModel.findOne({
			user: userId
		}).populate('products')

		if (!favorite) throw new NotFoundException('Favorite not found')

		return favorite
	}

	async addProductToFavorite(userId: string, productId: string) {
		const favorite = await this.FavoriteModel.findOne({ user: userId })
		const product = await this.ProductModel.findById(productId)

		if (!favorite) throw new NotFoundException('Favorite not found')
		if (!product) throw new NotFoundException('Product not found')

		const updateResult = await this.FavoriteModel.findOneAndUpdate(
			{ user: userId },
			{ $addToSet: { products: productId } },
			{ new: true, upsert: true }
		)

		if (!updateResult) {
			throw new NotFoundException('Favorite not found')
		}

		return updateResult
	}

	async removeProductFromFavorite(userId: string, productId: string) {
		const favorite = await this.FavoriteModel.findOne({ user: userId })
		const product = await this.ProductModel.findById(productId)

		if (!favorite) throw new NotFoundException('Favorite not found')
		if (!product) throw new NotFoundException('Product not found')

		const updateResult = await this.FavoriteModel.findOneAndUpdate(
			{ user: userId },
			{ $pull: { products: productId } },
			{ new: true }
		)

		if (!updateResult) {
			throw new NotFoundException('Favorite not found')
		}

		return updateResult
	}
}
