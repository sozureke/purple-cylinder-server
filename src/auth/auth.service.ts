import {
	BadRequestException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { compare, genSalt, hash } from 'bcryptjs'

import { JwtService } from '@nestjs/jwt'
import { InjectModel } from 'nestjs-typegoose'
import { CartService } from 'src/cart/cart.service'
import { FavoriteService } from 'src/favorite/favorite.service'
import { UserModel } from 'src/user/user.model'
import { AuthDto } from './dto/auth.dto'
import { RefreshTokenDto } from './dto/refreshToken.dto'

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
		private readonly cartService: CartService,
		private readonly favoriteService: FavoriteService,
		private readonly jwtService: JwtService
	) {}

	async isUserExist(dto: AuthDto): Promise<UserModel> {
		return await this.UserModel.findOne({ email: dto.email })
	}

	async login(
		dto: AuthDto
	): Promise<{ user: any; accessToken: string; refreshToken: string }> {
		const user = await this.validateUser(dto)
		if (!user) throw new UnauthorizedException('Invalid credentials')

		const tokens = await this.issueTokenPair(String(user._id))

		return { user: this.returnUserFields(user), ...tokens }
	}

	async register(
		dto: AuthDto
	): Promise<{ user: any; accessToken: string; refreshToken: string }> {
		if (await this.isUserExist(dto)) {
			throw new BadRequestException('User with this email already exists')
		}

		const salt = await genSalt(12)
		const newUser = new this.UserModel({
			name: dto.name,
			surname: dto.surname,

			email: dto.email,
			password: await hash(dto.password, salt)
		})

		const user = await newUser.save()

		const cart = await this.cartService.createCart(String(user._id))
		const favorite = await this.favoriteService.createFavorite(String(user._id))
		const tokens = await this.issueTokenPair(String(user._id))

		user.cart = cart._id
		user.favorite = favorite._id

		await user.save()
		return { user: this.returnUserFields(user), ...tokens }
	}

	async getNewTokens({ refreshToken }: RefreshTokenDto) {
		if (!refreshToken)
			throw new UnauthorizedException('Invalid token or you did not sign in')

		let token
		try {
			token = await this.jwtService.verifyAsync(refreshToken)
		} catch (error) {
			throw new UnauthorizedException('Invalid token or it has expired')
		}

		const user = await this.UserModel.findById(token._id)
		const tokens = await this.issueTokenPair(String(user._id))

		return { user: this.returnUserFields(user), ...tokens }
	}

	async validateUser(dto: AuthDto): Promise<UserModel> {
		const user = await this.isUserExist(dto)
		if (!user) {
			throw new UnauthorizedException('User with this email does not exist')
		}

		const isValidPassword = await compare(dto.password, user.password)
		if (!isValidPassword) throw new UnauthorizedException('Invalid password')

		return user
	}

	async issueTokenPair(
		userId: string
	): Promise<{ accessToken: string; refreshToken: string }> {
		const data = { _id: userId }
		const refreshToken = await this.jwtService.signAsync(data, {
			expiresIn: '15d'
		})

		const accessToken = await this.jwtService.signAsync(data, {
			expiresIn: '1h'
		})

		return { refreshToken, accessToken }
	}
	returnUserFields(user: UserModel) {
		return {
			_id: user._id,
			email: user.email,
			cart: user.cart,
			favorite: user.favorite,
			isAdmin: user.isAdmin
		}
	}
}
