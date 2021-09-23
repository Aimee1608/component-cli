export default {
	postcssOptions: {
		autoprefixer: {},
		plugins:[
			[
				require.resolve('postcss-px-to-viewport'),
				{
					viewportWidth: 375,
					viewportHeight: 667,
					unitPrecision: 3,
					viewportUnit: 'vw',
					selectorBlackList: ['.ignore', '.hairlines'],
					minPixelValue: 1,
					mediaQuery: false,
					exclude: /(\/|\\)(node_modules)(\/|\\)/
				}
			]
		]
	}
}
