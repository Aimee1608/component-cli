import {merge} from 'webpack-merge'
import {baseConfig} from "./webpack.base";
import {join} from 'path'
import {ES_DIR, LIB_DIR} from "../common/constant";
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin'

export function getPackageConfig({isMinify, outputName}) {
	return merge(baseConfig,{
		mode: 'production',
		entry: {
			main: join(ES_DIR, 'install.js')
		},
		stats: 'none',
		output: {
			path: LIB_DIR,
			library: `LuBanComponent_${outputName}`,
			libraryTarget: 'umd',
			libraryExport: 'default',
			filename:  isMinify ? `${outputName}.min.js` : `${outputName}.js`,
			umdNamedDefine: true,
			// https://github.com/webpack/webpack/issues/6522
			globalObject: "typeof self !== 'undefined' ? self : this",
		},
		externals: {
			vue: {
				root: 'Vue',
				commonjs: 'vue',
				commonjs2: 'vue',
				amd: 'vue',
			},
		},
		performance: false,
		optimization: {
			minimize: isMinify,
		},
		plugins: [
			new NodePolyfillPlugin()
		]
	})
}
