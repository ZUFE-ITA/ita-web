import type { Context } from '~~/server/trpc/context'
import { initTRPC } from '@trpc/server'
import { isNil } from 'lodash-es'

const t = initTRPC.context<Context>().create()

export const router = t.router

export const middleware = t.middleware

export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
	const { userId } = ctx
	if (isNil(userId)) {
		throw new UnauthorizedErrorWithI18n(i18n.pleaseLogIn)
	}
	const userInfo = await ctx.db.user
		.findUniqueOrThrow({
			where: {
				id: userId,
			},
			select: {
				id: true,
				email: true,
				username: true,
			},
		})
		.catch(() => {
			setCookie(ctx.event, 'auth-token', '', {
				httpOnly: true,
				expires: new Date(0),
			})
			throw new UnauthorizedErrorWithI18n(i18n.pleaseLogIn)
		})
	return next({ ctx: { ...ctx, userInfo } })
})
