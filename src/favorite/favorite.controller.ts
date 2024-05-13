import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post
} from '@nestjs/common'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { FavoriteService } from './favorite.service'

@Controller('favorite')
export class FavoriteController {
	constructor(private readonly FavoriteService: FavoriteService) {}

	@Get(':id')
	async getFavoriteItems(@Param('id', IdValidationPipe) userId: string) {
		return this.FavoriteService.getFavoriteItems(userId)
	}

	@Post(':id')
	@HttpCode(200)
	async addProductToFavorites(
		@Param('id') userId: string,
		@Body('productId') productId: string
	): Promise<{ message: string }> {
		await this.FavoriteService.addProductToFavorite(userId, productId)
		return { message: 'Product added to favorites successfully!' }
	}

	@Delete(':id')
	@HttpCode(200)
	async removeProductFromFavorites(
		@Param('id') userId: string,
		@Body('productId') productId: string
	): Promise<{ message: string }> {
		await this.FavoriteService.removeProductFromFavorite(userId, productId)
		return { message: 'Product removed from favorites successfully!' }
	}
}
