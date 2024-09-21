import { protectedProcedure, router } from '../trpc'

export const UserRouter = router({
	auth: protectedProcedure.mutation(async ({ ctx: { userInfo } }) => {
		return userInfo
	}),
})
