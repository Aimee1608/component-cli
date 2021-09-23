import { parse } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { compileCss } from './compile-css';
import { compileLess } from './compile-less';
import {replaceExt} from '../common/index'

async function compileFile(filePath) {
	const parsedPath = parse(filePath);

	try {
		if (parsedPath.ext === '.less') {
			const source = await compileLess(filePath);
			return await compileCss(source);
		}

		const source = readFileSync(filePath, 'utf-8');
		return await compileCss(source);
	} catch (err) {
		throw err;
	}
}

export async function compileStyle(filePath) {
	// console.log('compileStyle filePath', filePath)
	const css = await compileFile(filePath);

	writeFileSync(replaceExt(filePath, '.css'), css);
}
