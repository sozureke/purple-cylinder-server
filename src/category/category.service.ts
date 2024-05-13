import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { CategoryModel } from './category.model'
import { CreateCategoryDto } from './dto/create-category.dto'

@Injectable()
export class CategoryService {
	constructor(
		@InjectModel(CategoryModel)
		private readonly CategoryModel: ModelType<CategoryModel>
	) {}

	async findCategoryById(_id: string) {
		const category = await this.CategoryModel.findById(_id)
		if (!category) throw new NotFoundException('Category not found')

		return category
	}

	async updateCategory(_id: string, dto: CreateCategoryDto) {
		const updatedCategory = await this.CategoryModel.findByIdAndUpdate(
			_id,
			dto,
			{ new: true }
		).exec()

		if (!updatedCategory) throw new NotFoundException('Category not found')
		return updatedCategory
	}

	async createCategory() {
		const defaultValue: CreateCategoryDto = {
			name: '',
			slug: ''
		}
		const category = await this.CategoryModel.create(defaultValue)
		return category._id
	}

	async getCountCategories() {
		return this.CategoryModel.find().countDocuments().exec()
	}

	async getAllCategories(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{ name: new RegExp(searchTerm, 'i') },
					{ slug: new RegExp(searchTerm, 'i') }
				]
			}
		}

		return this.CategoryModel.find(options)
			.select('-updatedAt -__v')
			.sort({ createdAt: 'desc' })
			.exec()
	}
	async getCategory() {
		return this.CategoryModel.find().exec()
	}

	async deleteCategory(id: string) {
		const deletedCategory =
			await this.CategoryModel.findByIdAndDelete(id).exec()

		if (!deletedCategory) throw new NotFoundException('Category not found')
		return deletedCategory
	}

	async findCategoryBySlug(slug: string) {
		return this.CategoryModel.findOne({ slug }).exec()
	}
}
