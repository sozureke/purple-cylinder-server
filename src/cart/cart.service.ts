import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { ProductModel } from 'src/product/product.model'
import { CreateCartDto } from './cart.dto'
import { CartItem, CartModel } from './cart.model'

@Injectable()
export class CartService {
	constructor(
		@InjectModel(CartModel) private readonly CartModel: ModelType<CartModel>,
		@InjectModel(ProductModel)
		private readonly ProductModel: ModelType<ProductModel>
	) {}
	async createCart(userId: string): Promise<CartModel> {
		const defaultValue: CreateCartDto = {
			user: userId,
			items: [],
			totalPrice: 0
		}

		const cart = await this.CartModel.create(defaultValue)
		return cart
	}

	async clearCart(userId: string): Promise<CartModel> {
		const cart = await this.CartModel.findOne({ user: userId })
		if (!cart) throw new NotFoundException('Cart not found')

		cart.items = []
		cart.totalPrice = 0

		await cart.save()

		return cart
	}

	async getCartItems(userId: string): Promise<CartModel> {
		const cart = await this.CartModel.findOne({ user: userId }).populate(
			'items.product'
		)
		if (!cart) throw new NotFoundException('Cart not found')

		return cart
	}

	async getTotalPrice(userId: string): Promise<number> {
		const cart = await this.CartModel.findOne({ user: userId })
		return cart.totalPrice
	}

	async addProductToCart(
		userId: string,
		productId: string,
		quantity: number
	): Promise<CartModel> {
		const cart = await this.CartModel.findOne({ user: userId })

		if (!cart) {
			throw new NotFoundException('Cart not found')
		}

		const productIndex = cart.items.findIndex(
			item => item.product.toString() === productId
		)

		if (productIndex > -1) {
			cart.items[productIndex].quantity += quantity
		} else {
			// TODO: Fix the type of product
			cart.items.push({ product: productId as any, quantity })
		}

		cart.totalPrice = await this.calculateTotalPrice(cart.items)

		cart.markModified('items')
		await cart.save()

		return cart
	}

	async calculateTotalPrice(items: CartItem[]): Promise<number> {
		const prices = await Promise.all(
			items.map(async item => {
				const product = await this.ProductModel.findById(item.product)
				if (!product) {
					throw new NotFoundException(
						`Product with ID ${item.product.toString()} not found`
					)
				}
				const itemPrice = product.parameters.price || 0
				return itemPrice * item.quantity
			})
		)

		return prices.reduce((total, price) => total + price, 0)
	}

	async deleteItemFromCart(
		userId: string,
		productId: string
	): Promise<CartModel> {
		const cart = await this.CartModel.findOne({ user: userId })

		if (!cart) {
			throw new NotFoundException('Cart not found')
		}

		const initialLength = cart.items.length
		cart.items = cart.items.filter(
			item => item.product.toString() !== productId
		)

		if (cart.items.length === initialLength) {
			throw new NotFoundException('Product not found in cart')
		}

		cart.totalPrice = await this.calculateTotalPrice(cart.items)

		await cart.save()

		return cart
	}
}
