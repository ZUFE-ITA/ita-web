import { UserLoginSubmitFormValidator, UserRegisterSubmitDataValidator } from '~/utils/validator'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const UserRouter = router({
	auth: protectedProcedure.mutation(async ({ ctx: { userInfo } }) => {
		return userInfo
	}),

	login: publicProcedure
		.input(UserLoginSubmitFormValidator)
		.mutation(async ({ input, ctx: { db, event } }) => {
			const user = await db.user
				.findUniqueOrThrow({
					where: { email: input.email },
					select: { id: true, username: true, email: true, password: true },
				})
				.catch(
					createPrismaErrorHandler({
						OperationFailedError() {
							throw new ForbiddenErrorWithI18n(
								i18n.error.invalidEmailOrPassword,
							)
						},
						default() {
							throw new ForbiddenErrorWithI18n(i18n.error.loginFailed)
						},
					}),
				)
			if (!user || !bcryptVerify(input.password, user.password)) {
				throw new ForbiddenErrorWithI18n(i18n.error.invalidEmailOrPassword)
			}
			const token = await signToken({
				userId: user.id,
				remember: input.remember,
			})
			if (input.remember) {
				const maxAge = secs(config.OAUTH_EXPIRES_IN)
				setCookie(event, 'auth-token', token, {
					httpOnly: true,
					maxAge,
				})
			}
			else {
				setCookie(event, 'auth-token', token, {
					httpOnly: true,
				})
			}
			return {
				id: user.id,
				username: user.username,
				email: user.email,
			}
		}),

	logout: protectedProcedure.mutation(async ({ ctx: { event } }) => {
		setCookie(event, 'auth-token', '', {
			httpOnly: true,
			expires: new Date(0),
		})
	}),

	register: publicProcedure
		.input(UserRegisterSubmitDataValidator)
		.mutation(async ({ input, ctx: { db } }) => {
			const hashPassword = await bcryptEncrypt(input.password)
			await db.user
				.create({
					data: {
						username: input.username,
						email: input.email,
						password: hashPassword,
					},
				})
				.catch(
					createPrismaErrorHandler({
						UniqueConstraintError() {
							throw new ForbiddenErrorWithI18n(
								i18n.error.emailHasBeenRegistered,
							)
						},
						default() {
							throw new ForbiddenErrorWithI18n(i18n.error.registerFailed)
						},
					}),
				)
		}),
})
