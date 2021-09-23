import path, { sep } from 'path'
export const PROJECT_DIR = path.join(__dirname, '../../');
// console.log('PROJECT_DIR', PROJECT_DIR)
export const COMPONENT_DIR = process.cwd() // 组件目录
export const DIST_DIR = path.resolve(COMPONENT_DIR, 'dist')
export const README_DIR = path.resolve(COMPONENT_DIR, 'README.md')
export const SRC_DIR = path.resolve(COMPONENT_DIR, 'src')
export const ES_DIR = path.resolve(COMPONENT_DIR, 'es')
export const LIB_DIR = path.resolve(COMPONENT_DIR, 'lib')
export const COMMON_TEMPLATE_DIR = path.join(PROJECT_DIR, 'template', 'common')
export const GIT_BASE_URL = 'https://github.com/components'
export const BUCKET_BASE_URL = 'https://fe.mangoya.com/componentlib'

export const BABEL_CONFIG_FILE = path.join(PROJECT_DIR, 'src/config', 'babel.config.js');
export const ASSET_REGEXP = /\.(png|jpe?g|gif|webp|ico|jfif|svg|woff2?|ttf)$/i;
export const STYLE_REGEXP = /\.(css|less|scss)$/;
export const EXT_REGEXP = /\.\w+$/;
export const SFC_REGEXP = /\.(vue)$/;
export const SCRIPT_REGEXP = /\.(js|ts|jsx|tsx)$/;
export const DEMO_REGEXP = new RegExp('\\' + sep + 'demo$');
export const TEST_REGEXP = new RegExp('\\' + sep + 'test$');

export const POSTCSS_CONFIG_FILE = path.join(PROJECT_DIR, 'src/config', 'postcss.config.js')

export const PROJECT_TEMPLATE_PATH_CONFIG = {
	'UI-vue2': path.join(PROJECT_DIR, 'template/vue2'),
	'FUNC': path.join(PROJECT_DIR, 'template/utils')
}

export const TEMPLATE_TYPE_CONFIG = {
	'UI-vue2': 'UI组件-vue2',
	'FUNC': '通用函数组件'
}

export const WEBPACK_CONFIG = {
	'UI-vue2': {
		entry: './public/main.js',
		HtmlTemplate: "./public/index.html",
		commonIndex: `import App from '${path.join(COMPONENT_DIR, 'src/demo', 'index.vue')}';export default App`
	},
	'FUNC': {
		entry: './public/common/index.js',
		HtmlTemplate: `${COMPONENT_DIR}/index.html`,
		commonIndex: `import func from '${path.resolve(COMPONENT_DIR, 'src', 'index.js')}';window.func = func`
	}
}
