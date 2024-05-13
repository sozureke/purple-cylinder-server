import { UseGuards, applyDecorators } from '@nestjs/common'
import { TypeRole } from '../auth.interface'
import { onlyAdminGuard } from '../guards/admin.guard'
import { JwtAuthGuard } from '../guards/jwt.guard'

export const Auth = (role: TypeRole = 'guest') =>
	applyDecorators(
		role === 'admin'
			? UseGuards(JwtAuthGuard, onlyAdminGuard)
			: UseGuards(JwtAuthGuard)
	)
