// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	future: {
		compatibilityVersion: 4,
	},
	modules: [
		'@unocss/nuxt',
	],
	unocss: {
		nuxtLayers: true,
	},
	devtools: { enabled: true },
})
