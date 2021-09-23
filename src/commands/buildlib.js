import { compileJs } from '../compile/compile-js'
import { compileSfc } from '../compile/compile-sfc';
import { compileStyle } from '../compile/compile-style'
import { compilePackage } from '../compile/compile-package'
import { copy, readdirSync, remove } from 'fs-extra'
import { ES_DIR, LIB_DIR, SRC_DIR } from '../common/constant'
import { join } from 'path'
import ora from 'ora'
import { isDemoDir, isTestDir, isDir, isScript, isSfc, isAsset, isStyle, setModuleEnv } from "../common";
import { getComponentInfo } from "../utils";


async function copySourceCode() {
	await copy(SRC_DIR, ES_DIR);
	await copy(SRC_DIR, LIB_DIR);
}

async function compileDir(dir) {
	const files = readdirSync(dir);

	await Promise.all(
		files.map((filename) => {
			const filePath = join(dir, filename);

			if (isDemoDir(filePath) || isTestDir(filePath)) {
				return remove(filePath);
			}

			if (isDir(filePath)) {
				return compileDir(filePath);
			}

			return compileFile(filePath);
		})
	);
}

async function compileFile(filePath) {
	if (isSfc(filePath)) {
		return compileSfc(filePath);
	}

	if (isScript(filePath)) {
		// console.log('compileFile compileJs', filePath)
		return compileJs(filePath);
	}

	if (isStyle(filePath)) {
		return compileStyle(filePath);
	}

	if (isAsset(filePath)) {
		return Promise.resolve();
	}

	return remove(filePath);
}

async function buildESMOutputs() {
	setModuleEnv('esmodule');
	await compileDir(ES_DIR);
}


async function buildCJSOutputs() {
	setModuleEnv('commonjs');
	await compileDir(LIB_DIR);
}

async function buildPackages() {
	setModuleEnv('esmodule')
	const componentInfo = await getComponentInfo()
	const outputName = omponentInfo.name
	await compilePackage({ isMinify: false, outputName });
	await compilePackage({ isMinify: true, outputName });
}
const tasks = [
	{
		text: 'Copy Source Code',
		task: copySourceCode,
	},
	{
		text: 'Build ESModule Outputs',
		task: buildESMOutputs,
	},
	{
		text: 'Build CommonJS Outputs',
		task: buildCJSOutputs,
	},
	{
		text: 'Build Package Outputs',
		task: buildPackages
	}
];
export async function runBuildTasks() {
	for (let i = 0; i < tasks.length; i++) {
		const { task, text } = tasks[i];
		const spinner = ora(text).start();

		try {
			/* eslint-disable no-await-in-loop */
			await task();
			spinner.succeed(text);
		} catch (err) {
			spinner.fail(text);
			console.log(err);
			throw err;
		}
	}

	// consola.success('Compile successfully');
}
