#!/usr/bin/env node
// 必须在文件头添加如上内容指定运行环境为node
import commander from 'commander'
import initAction from '../src/commands/init.js'
import devAction from '../src/commands/dev'
import buildAction from '../src/commands/build'

commander
    .command("init [path]")
    .description("组件模板 初始化")
    .action(function(path) {
        initAction(path)
    })

// 调试环境
commander
  .command('dev')
  .option('-p --port [port]', 'Port to run dev server')
  .description('开启本地服务')
  .action(function(options) {
    devAction(options.port || '9999');
  });

// 打包
commander
  .command('build')
	.option('-t --type [type]', 'Port to run dev server')
  .option('--link [link]')
  .description('打包')
  .action(async function(options) {
    process.env.NODE_ENV = 'production'
    await buildAction(options)
  });

// 查看版本号
commander
	.version(require('../package.json').version)
	.option('-v,--version', '查看版本号');
// 利用commander解析命令行输入，必须写在所有内容最后面
commander.parse(process.argv);

process.on('unhandledRejection', function (reason) {
  console.error(reason);                                 // eslint-disable-line no-console
});
