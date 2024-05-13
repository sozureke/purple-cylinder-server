import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Types } from 'mongoose'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CategoryService } from './category.service'
import { CreateCategoryDto } from './dto/create-category.dto'

@Controller('categories')
export class CategoryController {
	constructor(private readonly CategoryService: CategoryService) {}

	@Get('by-slug/:slug')
	async getCategoryBySlug(@Param('slug') slug: string) {
		return this.CategoryService.findCategoryBySlug(slug)
	}

	@Get()
	async getAllCategories() {
		return this.CategoryService.getAllCategories()
	}

	@Get(':id')
	@Auth('admin')
	async getCategoryById(@Param('id') id: string) {
		return this.CategoryService.findCategoryById(id)
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@Auth('admin')
	@HttpCode(200)
	async updateCategory(
		@Param('id') id: string,
		@Body() dto: CreateCategoryDto
	): Promise<{ message: string }> {
		await this.CategoryService.updateCategory(id, dto)
		return { message: 'Category updated successfully' }
	}

	@UsePipes(new ValidationPipe())
	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async deleteCategory(@Param('id') id: string): Promise<{ message: string }> {
		await this.CategoryService.deleteCategory(id)
		return { message: 'Category deleted successfully' }
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth('admin')
	async createCategory(): Promise<{
		categoryId: Types.ObjectId
		message: string
	}> {
		const category = await this.CategoryService.createCategory()
		return { categoryId: category, message: 'Category created successfully' }
	}
}
