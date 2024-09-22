// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	future: {
		compatibilityVersion: 4,
	},

	build: {
		transpile: [ 'trpc-nuxt' ],
	},

	modules: [ '@unocss/nuxt', '@pinia/nuxt', 'shadcn-nuxt', 'nitro-cloudflare-dev' ],

	nitro: {
		experimental: {
			wasm: true,
		},
	},

	unocss: {
		nuxtLayers: true,
	},

	shadcn: {
		prefix: '',
		componentDir: './app/components/ui',
	},

	devtools: { enabled: true },

	compatibilityDate: '2024-09-21',
})
