import { readFileSync, removeSync, outputFileSync} from 'fs-extra'
import {transformAsync} from '@babel/core'
import {EXT_REGEXP} from '../common/constant'
import {replaceCSSImportExt, replaceScriptImportExt} from '../common'
import babelConfig from '../config/babel.config'
export function replaceExt(path, ext) {
	return path.replace(EXT_REGEXP, ext);
}
export async function compileJs(filePath){
	return new Promise((resolve, reject)=>{
		// const { BABEL_MODULE, NODE_ENV } = process.env;
		// const isTest = NODE_ENV === 'test';
		// const useESModules = BABEL_MODULE !== 'commonjs' && !isTest;
		// console.log('useESModules ==================>', useESModules)


		let code = readFileSync(filePath, 'utf-8');
		code = replaceCSSImportExt(code);
		code = replaceScriptImportExt(code, '.vue', '');
		const config = babelConfig()
		// transformAsync(code, {
		// 	filename: filePath,
		// 	presets: [
		// 		[
		// 			require.resolve('@babel/preset-env'),
		// 			{
		// 				modules: useESModules ? false : 'commonjs',
		// 			}
		// 		]
		// 	],
		// 	plugins: [
		// 		[
		// 			require.resolve('@babel/plugin-transform-runtime'),
		// 			{
		// 				useESModules,
		// 				corejs: false
		// 			}
		// 		]
		// 	],
		// })
		transformAsync(code, Object.assign({ filename: filePath}, config))
			.then((result) => {
				if (result) {
					const jsFilePath = replaceExt(filePath, '.js');
					// console.log('result.code', result.code)
					removeSync(filePath);
					outputFileSync(jsFilePath, result.code);
					resolve();
				}
			})
			.catch(reject);
	})
}
