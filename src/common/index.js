import { lstatSync } from 'fs-extra';
import {DEMO_REGEXP, TEST_REGEXP, ASSET_REGEXP, SFC_REGEXP, STYLE_REGEXP, SCRIPT_REGEXP, EXT_REGEXP} from './constant'


export function isDir(dir) {
	return lstatSync(dir).isDirectory();
}

export function isDemoDir(dir) {
	return DEMO_REGEXP.test(dir);
}

export function isTestDir(dir) {
	return TEST_REGEXP.test(dir);
}

export function isAsset(path) {
	return ASSET_REGEXP.test(path);
}

export function isSfc(path) {
	return SFC_REGEXP.test(path);
}

export function isStyle(path) {
	return STYLE_REGEXP.test(path);
}

export function isScript(path) {
	return SCRIPT_REGEXP.test(path);
}


export function replaceExt(path, ext) {
	return path.replace(EXT_REGEXP, ext);
}

export function setModuleEnv(value) {
	process.env.BABEL_MODULE = value;
}

const CSS_LANG = 'css' | 'less' | 'scss';
const IMPORT_STYLE_RE = /import\s+?(?:(?:".*?")|(?:'.*?'))[\s]*?(?:;|$|)/g;
// "import 'a.less';" => "import 'a.css';"
export function replaceCSSImportExt(code) {
	return code.replace(IMPORT_STYLE_RE, (str) =>
		str.replace(`.less`, '.css')
	);
}


// https://regexr.com/47jlq
const IMPORT_RE = /import\s+?(?:(?:(?:[\w*\s{},]*)\s+from(\s+)?)|)(?:(?:".*?")|(?:'.*?'))[\s]*?(?:;|$|)/g;

function matchImports(code){
	const imports = code.match(IMPORT_RE) || [];
	return imports.filter((line) => !line.includes('import type'));
}

// "import App from 'App.vue';" => "import App from 'App.xxx';"
export function replaceScriptImportExt(code, from, to) {
	const importLines = matchImports(code);

	importLines.forEach((importLine) => {
		const result = importLine.replace(from, to);
		code = code.replace(importLine, result);
	});

	return code;
}
