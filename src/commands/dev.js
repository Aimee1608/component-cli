
import webpackDevServer from 'webpack-dev-server'
import webpack from 'webpack'
import path from 'path'
import chalk from 'chalk'
import getConfig from '../../webpack/config'
import { getComponentInfo } from '../utils'
async function devAction(port) {
  console.log(chalk.red('component-cli 图片只支持url'))
  const options = {
    disableHostCheck: true,
    contentBase: path.join(__dirname, 'dist'), // html所在路径
    compress: true, // 是否压缩
    port: port,
    hot: true, // 热部署
    open: true, // 打包后自动打开网页
  };
  const componentInfo = await getComponentInfo()
  const config = getConfig(componentInfo.type, componentInfo.name)
  // console.log(JSON.stringify(config))
  config.mode = 'development'
  const compiler = webpack(config);
  const server = new webpackDevServer(compiler, options);

  server.listen(port, 'localhost', () => {
    console.log(`dev server listening on port ${port}`);
  });
}
export default devAction
