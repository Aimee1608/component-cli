// const Handlebars = require('handlebars');
import fs from 'fs-extra'
import ejs from 'ejs'
import path from 'path'
/**
 * Render data to files
 *
 * @param  {string} dir  渲染文件夹
 * @param  {Object} data 数据
 */
 // async function renderDir(dir, data) {
 //     console.log('dir', dir)
 //    const files = (await fs.readdir(dir)).filter((filename)=>{
 //        return /\.(less|css|view|js|md|vue|json)$/gi.test(filename);
 //    });
 //    console.log('files', files)
 //    await Promise.all(files.map(async (file) => {
 //      const filepath = dir + '/' + file;
 //      const content = await fs.readFile(filepath, 'utf8');
 //      const template = Handlebars.compile(content);
 //      const res = template(data)
 //      await fs.outputFile(filepath, res);
 //    }));
 //  }
async function renderDir(dir, data) {
	// console.log(readDir(dir))
	const files = readDir(dir).filter((filename)=>{
		return /\.(less|css|view|js|md|vue|json)$/gi.test(filename);
	});
	// console.log('files', files)
	await Promise.all(files.map(async (file) => {
		const filepath = file;
		const content = await fs.readFile(filepath, 'utf8');
		const res = ejs.render(content, data, {
			escape: function (d) {
				if (Array.isArray(d)) {
					return d.join("\",\"")
				}
				return d
			}
		})
		await fs.outputFile(filepath, res);
	}));
}

function readDir(entry) {
	var filesList = []
	const _readFileList = (entry) => {
		const files = fs.readdirSync(entry)
		files.forEach(item => {
			const fullPath = path.join(entry, item)
			const info = fs.statSync(fullPath)
			if (info.isDirectory()) {
				_readFileList(path.join(entry, item), filesList)
			} else {
				filesList.push(fullPath)
			}
		})
	}
	_readFileList(entry)
	return filesList
}

export default renderDir
