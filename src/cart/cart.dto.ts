import { Type } from 'class-transformer'
import {
	IsArray,
	IsNumber,
	IsString,
	Min,
	ValidateNested
} from 'class-validator'

class CartItemDto {
	@IsString()
	product: string

	@IsNumber()
	@Min(1)
	quantity: number
}

export class CreateCartDto {
	@IsString()
	user: string

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CartItemDto)
	items: CartItemDto[]

	@IsNumber()
	@Min(0)
	totalPrice: number
}

export class UpdateCartDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CartItemDto)
	items?: CartItemDto[]
}
