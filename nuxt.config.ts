// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	future: {
		compatibilityVersion: 4,
	},

	build: {
		transpile: [ 'trpc-nuxt' ],
	},

	modules: [ '@unocss/nuxt', '@pinia/nuxt' ],

	unocss: {
		nuxtLayers: true,
	},

	devtools: { enabled: true },

	compatibilityDate: '2024-09-21',
})
