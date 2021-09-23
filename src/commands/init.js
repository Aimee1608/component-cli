import path from 'path'
import fs from 'fs-extra'
import ora from 'ora'
import shelljs from 'shelljs'// 系统命令行交互
import chalk from 'chalk'
import str from 'underscore.string'
import { getPackageJsonConfig } from '../utils'
import { getText, confirm } from '../utils/utils'
import renderDir from '../utils/render'
import { PROJECT_TEMPLATE_PATH_CONFIG, GIT_BASE_URL, COMMON_TEMPLATE_DIR } from '../common/constant'
import { getAccessToken, getUserInfo, checkToken } from '../utils/git'
async function getWidgetDir(targetPath) {
  const projectDir = process.cwd(); // Node.js 进程的当前工作目录
  const parsedTargetPath = path.parse(targetPath)
  const aValidNameFromPath = !['', '.'].includes(parsedTargetPath.base)
  const baseName = aValidNameFromPath ? parsedTargetPath.base : await getText('输入项目名称: ( 如: testComponent, 小驼峰 )');
  const componentName = str(baseName)
    .trim()
    .classify()
    .underscored()
    .value();
  const result = /^[a-z_]*$/g.test(componentName)
  if (!result) {
    console.log(`Please enter a valid component name!`)
    return
  }
  parsedTargetPath.base = componentName
  targetPath = path.format(parsedTargetPath)
  // 目标路径
  return {
    widgetDir: targetPath
      ? (path.isAbsolute(targetPath) ? targetPath : path.resolve(projectDir, targetPath))
      : path.join(projectDir, componentName),
    componentName
  }
}

async function initAction(targetPath = '') {

  // 判断用户创建的项目在远端是否存在
  console.log('path', targetPath)
  // TODO: 取消
  // let accessToken = await getAccessToken();
  // 写入开发人员
  // TODO: 取消
  // let userInfo = await getUserInfo(accessToken)
  // let result = await checkToken(userInfo)
  let result = { accessToken: '', userInfo: { name: 'aimee' } }
  let accessToken = result?.accessToken
  let userInfo = result?.userInfo

  const { widgetDir, componentName } = await getWidgetDir(targetPath)
  // const projectInfo = await getProjectInfo(accessToken, componentName);
  // if (projectInfo.id) {
  // 	console.log(chalk.bgRedBright(`当前项目在远端已有相同的项目名称\n git 地址 ${chalk.yellow(projectInfo.http_url_to_repo)}`))
  // 	console.log(chalk.bgYellowBright(`您可以选择重新创建项目，或者使用当前组件库中已存在的项目`))
  // 	return
  // }
  // 同名文件检测
  const pathIsExists = await fs.pathExists(widgetDir)
  pathIsExists && !await confirm('同名文件已存在，是否覆盖？') && shelljs.exit(1)

  const packageJsonConfig = await getPackageJsonConfig({ componentName })
  if (!packageJsonConfig) return // 用户未确认创建

  const initLoading = ora('项目模板初始化...').start();
  pathIsExists && await fs.remove(widgetDir) // 用户确认创建后移除已经存在的文件
  await fs.copy(COMMON_TEMPLATE_DIR + '/package.json', widgetDir + '/package.json')
  await fs.copy(COMMON_TEMPLATE_DIR + '/.gitignoreTemplate', widgetDir + '/.gitignore')
  await fs.copy(PROJECT_TEMPLATE_PATH_CONFIG[packageJsonConfig.componentType], widgetDir)

  // git 相关
  const gitName = componentName
  // TODO: 取消
  // await setProjectOrigin(accessToken, gitName, widgetDir)
  // 渲染模板
  await renderDir(widgetDir, {
    name: componentName,
    componentName: str(targetPath || componentName).capitalize().value(), // 驼峰格式：ComponentName
    description: packageJsonConfig.description,
    componentType: packageJsonConfig.componentType,
    author: userInfo.name,
    gitUrl: `${GIT_BASE_URL}/${gitName}.git`
  })
  initLoading.succeed(chalk.green('项目模板初始化完成'));
  console.log(chalk.blue(`\ncd ${componentName}`))
  console.log(chalk.blue('component-cli dev'))
  console.log(chalk.red('component-cli 图片只支持url'))
}
export default initAction

