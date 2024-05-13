import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Put
} from '@nestjs/common'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { CartService } from './cart.service'

@Controller('cart')
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@Get(':id')
	async getCartItems(@Param('id', IdValidationPipe) userId: string) {
		return this.cartService.getCartItems(userId)
	}

	@Get('total/:id')
	async getTotalPrice(
		@Param('id', IdValidationPipe) userId: string
	): Promise<number> {
		return this.cartService.getTotalPrice(userId)
	}

	@Put('delete/:id')
	@HttpCode(200)
	async deleteItemFromCart(
		@Param('id', IdValidationPipe) userId: string,
		@Body('productId') productId: string
	) {
		await this.cartService.deleteItemFromCart(userId, productId)
		return { message: 'Product deleted successfully' }
	}

	@Delete(':id')
	@HttpCode(200)
	async clearCart(
		@Param('id', IdValidationPipe) userId: string
	): Promise<{ message: string }> {
		await this.cartService.clearCart(userId)
		return { message: 'Cart cleared successfully' }
	}

	@Put(':id')
	@HttpCode(200)
	async addProductToCart(
		@Body('userId') userId: string,
		@Body('productId') productId: string,
		@Body('quantity') quantity: number
	): Promise<{ message: string }> {
		await this.cartService.addProductToCart(userId, productId, quantity)
		return { message: 'Product added successfully' }
	}
}
