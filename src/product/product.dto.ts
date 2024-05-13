import { IsArray, IsEnum, IsNumber, IsObject, IsString } from 'class-validator'
import { ProductStatus } from './product.enum'

export class Parameters {
	@IsNumber()
	price: number

	@IsArray()
	@IsString({ each: true })
	sizes: string[]

	@IsArray()
	@IsString({ each: true })
	colors: string[]

	@IsEnum(ProductStatus)
	status: ProductStatus
}

export class ProductDto {
	@IsString()
	name: string

	@IsString()
	description: string

	@IsString()
	slug: string

	@IsArray()
	@IsString({ each: true })
	images: string[]

	@IsObject()
	parameters?: Parameters

	@IsArray()
	@IsString({ each: true })
	category: string[]
}
