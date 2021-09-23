import { POSTCSS_CONFIG_FILE } from '../common/constant'
import webpack from 'webpack';
import { VueLoaderPlugin } from 'vue-loader';

const SCRIPT_EXTS = ['.js', '.jsx', '.vue', '.ts', '.tsx'];
const STYLE_EXTS = ['.css', '.less', '.scss'];


const { BABEL_MODULE, NODE_ENV } = process.env;
const isTest = NODE_ENV === 'test';
const useESModules = BABEL_MODULE !== 'commonjs' && !isTest;


const CSS_LOADERS = [
	require.resolve('style-loader'),
	require.resolve('css-loader'),
	{
		loader: require.resolve('postcss-loader'),
		options: require(POSTCSS_CONFIG_FILE).default
	},
];

const VUE_LOADER = {
	loader: require.resolve('vue-loader'),
	options: {
		compilerOptions: {
			preserveWhitespace: false,
		},
	},
};

const plugins = [
	new webpack.DefinePlugin({
		__VUE_OPTIONS_API__: 'true',
		__VUE_PROD_DEVTOOLS__: 'false',
	}),
	new VueLoaderPlugin(),
];


export const baseConfig = {
	mode: 'development',
	// context: PROJECT_DIR,
	resolve: {
		extensions: [...SCRIPT_EXTS, ...STYLE_EXTS],
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				use: [VUE_LOADER],
			},
			{
				test: /\.(js|ts|jsx|tsx)$/,
				exclude: /node_modules\/(?!(component-cli\/cli))/,
				use: [{
					loader: require.resolve('babel-loader'),
					options: {
						cacheDirectory: true,
						babelrc: false,
						presets: [
							[require.resolve('@babel/preset-env'), {
								loose: true,
								modules: useESModules ? false : 'commonjs',
							}]
						],
						plugins: [
							[
								require.resolve('@babel/plugin-transform-runtime'),
								{
									useESModules
								}
							]
						],
					}
				}],
			},
			{
				test: /\.css$/,
				sideEffects: true,
				use: CSS_LOADERS,
			},
			{
				test: /\.less$/,
				sideEffects: true,
				use: [...CSS_LOADERS, require.resolve('less-loader')],
			},
			{
				// 图片
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				use: {
					loader: require.resolve('url-loader'),
					options: {
						esModule: false,
						limit: 25000,
					},
				},
			}
		]
	},
	plugins
}
