import { IsArray, IsString } from 'class-validator'

export class FavoriteDto {
	@IsString()
	userId: string

	@IsArray()
	@IsString({ each: true })
	products: string[]
}
