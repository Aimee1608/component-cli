import {readFileSync, remove, writeFileSync} from 'fs-extra'
import hash from 'hash-sum';
import * as compiler from 'vue-template-compiler';
import * as compileUtils from '@vue/component-compiler-utils';
import {parse} from "path";
import {compileStyle} from './compile-style'
import {compileJs} from './compile-js'
export const EXT_REGEXP = /\.\w+$/;

const RENDER_FN = '__vue_render__';
const STATIC_RENDER_FN = '__vue_staticRenderFns__';
export function replaceExt(path, ext) {
	return path.replace(EXT_REGEXP, ext);
}

function getExportKeyword(script) {
	const EXPORT_DEFAULT = 'export default {';
	const EXPORT_WITH_DEFINE_COMPONENT = 'export default defineComponent({';
	return script.includes(EXPORT_WITH_DEFINE_COMPONENT)
		? EXPORT_WITH_DEFINE_COMPONENT
		: EXPORT_DEFAULT;
}

function getSfcStylePath(filePath, ext, index) {
	const number = index !== 0 ? `-${index + 1}` : '';
	return replaceExt(filePath, `-sfc${number}.${ext}`);
}

function injectStyle(script, styles, filePath) {
	if (styles.length) {
		const exportKeyword = getExportKeyword(script);
		const imports = styles
			.map((style, index) => {
				const { base } = parse(getSfcStylePath(filePath, 'css', index));
				return `import './${base}';`;
			})
			.join('\n');

		return script.replace(exportKeyword, `${imports}\n\n${exportKeyword}`)
	}

	return script;
}


function compileTemplate(template) {
	const result = compileUtils.compileTemplate({
		compiler,
		source: template,
		isProduction: true,
	});

	return result.code;
}
// trim some unused code
function trim(code) {
	return code.replace(/\/\/\n/g, '').trim();
}

// inject render fn to script
function injectRender(script, render) {
	script = trim(script);

	render = render
		.replace('var render', `var ${RENDER_FN}`)
		.replace('var staticRenderFns', `var ${STATIC_RENDER_FN}`);

	const exportKeyword = getExportKeyword(script);

	return script.replace(
		exportKeyword,
		`${render}\n${exportKeyword}\n  render: ${RENDER_FN},\n\n  staticRenderFns: ${STATIC_RENDER_FN},\n`
	);
}
function injectScopeId(script, scopeId) {
	const exportKeyword = getExportKeyword(script);
	return script.replace(
		exportKeyword,
		`${exportKeyword}\n  _scopeId: '${scopeId}',\n\n`
	);
}
export function parseSfc(filename) {
	const source = readFileSync(filename, 'utf-8');
	const descriptor = compileUtils.parse({
		source,
		compiler,
		needMap: false,
	});

	return descriptor;
}
export async function compileSfc(filePath) {
	const tasks = [remove(filePath)];
	const source = readFileSync(filePath, 'utf-8');
	const descriptor = parseSfc(filePath);

	const { template, styles, script } = descriptor;
	// console.log(filePath, descriptor)
	const hasScoped = styles.some((s) => s.scoped);
	const scopeId = hasScoped ? `data-v-${hash(source)}` : '';

	// compile js part
	if (descriptor.script) {
		const lang = descriptor.script.lang || 'js';
		const scriptFilePath = replaceExt(filePath, `.${lang}`);
		tasks.push(
			new Promise((resolve, reject) => {
				let script = descriptor.script&& descriptor.script.content;
				script = injectStyle(script, styles, filePath);
				// console.log('=======> script', script)
				if (template) {
					const render = compileTemplate(template.content);
					script = injectRender(script, render);
				}

				if (scopeId) {
					script = injectScopeId(script, scopeId);
				}
				// console.log('2222222 script', script)
				writeFileSync(scriptFilePath, script);
				compileJs(scriptFilePath).then(resolve).catch(reject);
			})
		);
	}

	// compile style part
	tasks.push(
		...styles.map((style, index) => {
			const cssFilePath = getSfcStylePath(filePath, style.lang || 'css', index);
			// console.log('=========> cssFilePath', cssFilePath, filePath)
			let styleSource = trim(style.content);

			if (style.scoped) {
				styleSource = compileUtils.compileStyle({
					id: scopeId,
					scoped: true,
					source: styleSource,
					filename: cssFilePath,
					preprocessLang: style.lang,
				}).code;
			}
			writeFileSync(cssFilePath, styleSource);
			return compileStyle(cssFilePath);
		})
	);

	return Promise.all(tasks);
}
