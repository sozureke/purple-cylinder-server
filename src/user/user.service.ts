import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { CartModel } from 'src/cart/cart.model'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserModel } from './user.model'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
		@InjectModel(CartModel) private readonly cartModel: ModelType<CartModel>
	) {}

	async byId(_id: string) {
		const user = await this.userModel.findById(_id)
		if (!user) throw new NotFoundException('User not found')

		return user
	}

	async updateProfile(_id: string, dto: UpdateUserDto) {
		const user = await this.byId(_id)
		const isSameUser = await this.userModel.findOne({ email: dto.email })

		if (dto.email && isSameUser && isSameUser._id.toString() !== _id) {
			throw new NotFoundException('Email is already in use')
		}

		if (dto.password) {
			user.password = dto.password
		}

		await user.save()
		return
	}

	async getCount() {
		return this.userModel.find().countDocuments().exec()
	}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{
						email: new RegExp(searchTerm, 'i')
					}
				]
			}
		}

		return this.userModel
			.find(options)
			.select('-password -updatedAt -__v')
			.sort({ createdAt: 'desc' })
			.exec()
	}

	async deleteUser(id: string) {
		const isUserExist = await this.userModel.findById(id)
		if (!isUserExist) throw new NotFoundException('User not found')
		await this.cartModel.findOneAndDelete({ user: id }).exec()
		return this.userModel.findByIdAndDelete(id).exec()
	}
}
