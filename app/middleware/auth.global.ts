const LOGIN_ROUTE = 'login'

export default defineNuxtRouteMiddleware(async (to) => {
	const { $pinia } = useNuxtApp()
	const auth = useAuthStore($pinia)
	if (auth.isAuth) {
		return
	}
	await useAsyncData('user-auth', () => auth.auth())
	if (auth.isAuth && to.name === LOGIN_ROUTE) {
		if (to.query.from) {
			return navigateTo(to.query.from as string)
		}
		return navigateTo('/')
	}
	if (!auth.isAuth && to.name !== LOGIN_ROUTE) {
		return navigateTo({ name: LOGIN_ROUTE, query: { from: to.fullPath } })
	}
})
