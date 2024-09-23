import antfu from '@antfu/eslint-config'

export default antfu({
	formatters: true,
	unocss: true,
	vue: true,
}, {
	rules: {
		'style/indent': [ 'error', 'tab' ],
		'vue/html-indent': [ 'error', 'tab' ],
		'jsonc/indent': [ 'error', 'tab' ],
		'style/no-tabs': 'off',
		'vue/array-bracket-spacing': [ 'error', 'always' ],
		'style/array-bracket-spacing': [ 'error', 'always' ],
	},
})
