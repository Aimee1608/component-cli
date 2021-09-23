import webpack from 'webpack'
import chalk from 'chalk'
import simpleGit from 'simple-git'
import getConfig from '../../webpack/config'
import upload from '../utils/upload'
import { getText } from '../utils/utils'
import { getComponentInfo, modifyFile } from '../utils'
import { DIST_DIR, README_DIR, GIT_BASE_URL, COMPONENT_DIR, ES_DIR, LIB_DIR } from '../common/constant'
import { saveComponentsMessage } from '../utils/api'
import { runBuildTasks } from './buildlib'
import { clean } from '../utils/clean'

function build(componentType, componentName) {
	const config = getConfig(componentType, componentName)
	config.mode = 'production'
	return new Promise((resolve, reject) => {
		webpack(config, (err, stats) => {
			if (err) {
				return reject(err);
			}
			const { errors, assets } = stats.compilation;
			if (errors.length > 0) {
				errors.forEach((err2) => {
					reject(err2);
				});
				return;
			}
			resolve(assets)
		})
	})
}
async function buildAction(config) {
	await clean()
	await runBuildTasks()
	const componentInfo = await getComponentInfo()
	// console.log('componentInfo', componentInfo)
	await modifyFile('package.json', { 'main': 'lib/install.js' })
	if (config.link === 'links') {
		return;
	}
	// return
	// 不发npm包没必要更改版本号
	if (config.type !== 'only') {
		// 手动输入版本号更改package.json文件里的version
		const version = await getText(`请输入组件库版本号(当前版本${componentInfo.version}): `)
		await modifyFile('package.json', { 'version': version })
		componentInfo.version = version
	}
	const assets = await build(componentInfo.type, componentInfo.name)
	// console.log('assets', assets)
	// TODO: 取消
	// const res = await saveComponentsMessage(componentInfo)
	// console.log('res', res.data)
	/**
	 * 组件/内容文件
	 */
	// TODO: 取消
	// await upload.uploadFiles({
	// 	uploadFrom: DIST_DIR,
	// 	uploadTo: componentInfo.name.substr(1) // 去掉@符，使上传路径合法
	// })
	// await upload.uploadFile({
	// 	uploadFilePath: README_DIR,
	// 	uploadTo: componentInfo.name.substr(1)
	// })

	// await upload.uploadFiles({
	// 	uploadFrom: LIB_DIR,
	// 	uploadTo: componentInfo.name.substr(1) + '/lib/' + componentInfo.version
	// })
	// 执行git 去push
	try {
		let name = componentInfo.name
		const gitName = name
		const url = `${GIT_BASE_URL}/${gitName}.git`;
		let version = componentInfo.version
		const git = simpleGit() // 进入git路径
		await git.add('./*')
			.commit(`Environment: [版本说明 ${version}]`)
		let branch = await git.branch()
		await git.push('origin', branch.current)
		console.log(chalk.green(`项目构建完成，已推送到git仓库\n git 地址${url}`))
	} catch (err) {
		console.log('error', err);
		console.log(chalk.bgRed(`您不在当前组件库的GIT组中`));
	}
}
export default buildAction
