import webpack from 'webpack'
import {getPackageConfig} from '../config/webpack.package'

export async function compilePackage({isMinify, outputName}) {
	// console.log('=========================>', outputName)
	return new Promise((resolve, reject) => {
		const config = getPackageConfig({isMinify, outputName})
		webpack(config, (err, stats) => {
			if (err || (stats?.hasErrors())) {
				reject(err || stats?.toString());
			} else {
				resolve();
			}
		});
	});
}
