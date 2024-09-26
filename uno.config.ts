// unocss.config.ts
import { defineConfig, presetUno } from 'unocss'
import presetAnimations from 'unocss-preset-animations'
import { presetShadcn } from './preset.shadcn'

export default defineConfig({
	presets: [
		presetUno(),
		presetAnimations(),
		presetShadcn(),
	],
	shortcuts: [
		{
			'animate-accordion-up': 'accordion-up',
			'animate-accordion-down': 'accordion-down',
		},
	],
	include: [ /\.ts/, /\.vue$/, /\.vue\?vue/ ],
})
