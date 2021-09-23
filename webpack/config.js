import path from 'path'
import {merge} from 'webpack-merge'
import {baseConfig} from "../src/config/webpack.base";
import HtmlWebpackPlugin from 'html-webpack-plugin'
import StringReplacePlugin from 'string-replace-webpack-plugin'
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
import { PROJECT_DIR, COMPONENT_DIR, WEBPACK_CONFIG, DIST_DIR} from '../src/common/constant'
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin'
const getConfig = (componentType, componentName) => {
	return merge(baseConfig,{
		context: PROJECT_DIR,
		entry: path.resolve(__dirname, WEBPACK_CONFIG[componentType].entry),
		output: {
			path: DIST_DIR,
			filename: '[name].[hash:8].build.js'
		},
		module: {
			rules: [
				{
					test: /webpack[\/ | \\]public[\/ | \\]common[\/ | \\]index\.js$/,
					exclude: [path.resolve(COMPONENT_DIR, 'node_modules')],
					use: {
						loader: StringReplacePlugin.replace({
							replacements: [
								{
									pattern: /^[\S\s]*/ig,
									replacement: function () {
										return WEBPACK_CONFIG[componentType].commonIndex;
									}
								}
							]
						})
					}
				},
			]
		},
		plugins: [
			new CleanWebpackPlugin(),
			new StringReplacePlugin(),
			new HtmlWebpackPlugin({
				filename: 'index.html',
				template: path.resolve(__dirname, WEBPACK_CONFIG[componentType].HtmlTemplate),
				inject: false, // 禁止在webpack将打包好的js文件自动加入到html中，模板中自定义好的js文件
				title: componentName
			}),
			new NodePolyfillPlugin()
		],
		externals: {
			vue: 'Vue'
		}
	})
}
module.exports = getConfig
