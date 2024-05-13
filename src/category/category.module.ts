import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'
import { CategoryController } from './category.controller'
import { CategoryModel } from './category.model'
import { CategoryService } from './category.service'

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: CategoryModel,
				schemaOptions: {
					collection: 'Category'
				}
			}
		]),
		ConfigModule
	],
	providers: [CategoryService],
	controllers: [CategoryController]
})
export class CategoryModule {}
