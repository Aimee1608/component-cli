import fs from 'fs-extra'
import path from 'path'
import inquirer from 'inquirer'
import { getComDetail } from './api'
import chalk from 'chalk'
import { TEMPLATE_TYPE_CONFIG, GIT_BASE_URL, BUCKET_BASE_URL } from '../common/constant'
import { getAccessToken, getProjectInfo, getUserInfo } from './git'
// 定义需要询问的问题
const questions = [

	{
		type: 'list',
		message: '请选择组件类型',
		name: 'componentType',
		choices: Object.values(TEMPLATE_TYPE_CONFIG),
		filter: function (val) {
			const componentType = TEMPLATE_TYPE_CONFIG
			const index = Object.values(componentType).findIndex((type) => {
				return type === val
			})
			return Object.keys(componentType)[index]
		}
	},
	{
		type: 'input',
		message: '请输入组件库中文名称（小于10字）',
		name: 'nameZH',
		validate: function (val) {
			val = val.trim()
			if (!/[\u4e00-\u9fa5]/.test(val) || val.length > 10) {
				return '请输入组件库中文名称（小于10字）'
			}
			return true
		}
	},
	{
		type: 'input',
		message: '请输入组件库描述信息',
		name: 'description'
	}
];

export async function getPackageJsonConfig(params = {}) {
	// 通过inquirer获取到用户输入的内容
	const answers = await inquirer.prompt(questions)
	const npmName = params.componentName
	console.log(chalk.green(JSON.stringify({
		...answers,
		npmName,
		gitName: npmName
	}, null, 2)))
	return new Promise(async (resolve, reject) => {
		// TODO: 取消
		// const res = await checkComponentSameName({
		// 	name: npmName,
		// 	type: answers.componentType
		// })
		const res = true
		if (res) {
			const confirm = await inquirer.prompt([
				{
					type: 'confirm',
					message: '确认创建？',
					default: 'Y',
					name: 'isConfirm'
				}
			])
			if (!confirm.isConfirm) resolve(false);
			resolve(answers)
		} else {
			console.log(chalk.red('已存在相同类型，相同名称的组件，请修改名称'))
			resolve(false)
		}
	})
}


/**
 * 获取组件名称
 * 从package.json中获取
 *
 * @return {string} 组件名称
 */
export async function getComponentInfo() {
	const componentPath = process.cwd();

	const sourcePackagePath = path.join(componentPath, 'package.json');
	const sourcePackageContent = require(sourcePackagePath)
	let author = sourcePackageContent.author
	let repository = sourcePackageContent.repository
	// TODO: 取消
	// if (!author) {
	// 	const accessToken = await getAccessToken();
	// 	const userInfo = await getUserInfo(accessToken)
	// 	author = userInfo.name
	// 	console.log('author', author)
	// 	await modifyFile('package.json', { 'author': userInfo.name })
	// }
	// // 兼容 v1.0.14以下 package.json未写入git地址
	// if (!repository) {
	// 	const gitName = ourcePackageContent.name
	// 	repository = {
	// 		"type": "git",
	// 		"url": `${GIT_BASE_URL}/${gitName}.git`
	// 	}
	// 	await modifyFile('package.json', { 'repository': repository })
	// }
	return {
		author: author,
		name: sourcePackageContent.name,
		type: sourcePackageContent.componentType,
		desc: sourcePackageContent.description,
		version: sourcePackageContent.version,
		repository: repository,
		demoUrl: `${BUCKET_BASE_URL}/${sourcePackageContent.name}/index.html?v=${+new Date()}`,
		readmeUrl: `${BUCKET_BASE_URL}/${sourcePackageContent.name}/README.md?v=${+new Date()}`,
		cdnUrlMin: formatCdnPath(sourcePackageContent).minUrl,
		cdnUrl: formatCdnPath(sourcePackageContent).url
	};
}

/**
 * @Description: 修改单一文件的内容
 * @param fileName  文件名称
 * @param content<Object> 要修改的字段 {key: target}
 */

export async function modifyFile(fileName, content) {
	const componentPath = process.cwd();
	const filePath = path.join(componentPath, fileName);
	try {
		const result = await fs.readJson(filePath)
		for (let [key, value] of Object.entries(content)) {
			// console.log('key== ', key, ' value===', value, result.hasOwnProperty(key))
			result[key] = value
		}
		let new_result = JSON.stringify(result, null, '\t')
		await fs.outputFile(filePath, new_result)
		console.log('写入成功')
	} catch (e) {
		console.log('err', e)
	}
}

/**
 * 格式化cdn路径
 */
export function formatCdnPath({ name, version }) {
	return {
		minUrl: `${BUCKET_BASE_URL}/${name}/lib/${version}/${name}.min.js`,
		url: `${BUCKET_BASE_URL}/${name}/lib/${version}/${name}.js`
	}
}
/**
 * 同名组件校验
 */
export async function checkComponentSameName(params) {
	const accessToken = await getAccessToken();
	return Promise.all([
		getComDetail({
			name: params.name,
			type: params.type
		}),
		getProjectInfo(accessToken, params.name)
	]).then(([res0, res1]) => {
		return !((res0 && res0.data) || (typeof res1 === 'object' && res1.id))
	})
}
