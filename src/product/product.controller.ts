import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Types } from 'mongoose'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { ProductDto } from './product.dto'
import { ProductService } from './product.service'

@Controller('products')
export class ProductController {
	constructor(private readonly ProductService: ProductService) {}

	@Get('by-slug/:slug')
	async GetProductBySlug(@Param('slug') slug: string) {
		return this.ProductService.bySlug(slug)
	}

	@Get('by-category/:id')
	async GetProductByCategory(
		@Param('id', IdValidationPipe) categoriesId: Types.ObjectId[]
	) {
		return this.ProductService.byCategory(categoriesId)
	}

	@Get(':id')
	@Auth('admin')
	async getProductById(@Param('id') id: string) {
		return this.ProductService.byId(id)
	}

	@Get()
	@Auth('admin')
	async GetAllProducts(@Query('searchTerm') searchTerm?: string) {
		return this.ProductService.getAllProducts(searchTerm)
	}

	@UsePipes(new ValidationPipe())
	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async deleteProduct(@Param('id') id: string): Promise<{ message: string }> {
		await this.ProductService.deleteProduct(id)
		return { message: 'Product deleted successfully' }
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async updateProduct(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: ProductDto
	): Promise<{ message: string }> {
		await this.ProductService.updateProduct(id, dto)
		return { message: 'Product updated successfully' }
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth('admin')
	async createProduct(): Promise<{
		productId: Types.ObjectId
		message: string
	}> {
		const product = await this.ProductService.createProduct()
		return { productId: product, message: 'Product created successfully' }
	}
}
