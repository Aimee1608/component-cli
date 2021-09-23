/* git 操作工具 */
import os from 'os'
import path from 'path'
import fs from 'fs-extra'
import chalk from 'chalk'
import simpleGit from 'simple-git'
import { getText } from './utils'
import fetch from './http'
const homedir = os.homedir();
const Secret = '.component-cli-key';

const GITLIB_PREFIX = 'https://github.com/api/v4';
const GITLIB_URLS = {
    USER_INFO: GITLIB_PREFIX + '/user',
    PROJECT_INFO: GITLIB_PREFIX + '/projects/',
    CREATE_PROJECT: GITLIB_PREFIX + '/projects/'
};
const FILDER = 'components'
/**
 * @Description: 获取 acces Token
 *
 */
async function getAccessToken(flag) {
    let token;
    if (flag) {
        console.log(`${chalk.bgRed('您的access token没有权限请重新获取, 如何获取请查看：')}`)
        token = await getText('请输入access token: ')
        fs.writeFileSync(path.join(homedir, Secret), token)
        return token
    }
    if (!fs.existsSync(path.join(homedir, Secret)) || fs.readFileSync(path.join(homedir, Secret), 'utf-8').length === 0) {
        console.log(`${chalk.bgRed('请输入gitlib access token, 如何获取请查看：')}`)
        token = await getText('请输入access token: ')
        fs.writeFileSync(path.join(homedir, Secret), token)
    } else {
        token = fs.readFileSync(path.join(homedir, Secret), 'utf-8')
    }
    if (!token) {
        throw Error('access token 不能为空')
    }
    // console.log('获取到的access token', token)
    return token
}

/**
 * @Description: 获取仓库信息
 * @param accessToken  access token
 * @param projectName  项目名称
 * @return  仓库信息 { boolean }
 */
async function getProjectInfo(accessToken, projectName) {
    return await fetch(GITLIB_URLS.PROJECT_INFO + encodeURIComponent(`${FILDER}/${projectName}`), 'get', accessToken)
}

/**
 * @Description: 创建仓库
 * @param accessToken  access token
 * @param projectName  项目名称
 * @return 403 没有权限
 */
async function createProject(accessToken, projectName) {
    return await fetch(GITLIB_URLS.PROJECT_INFO, 'post', accessToken, {
        name: projectName
    })
}

/**
 * @Description: 获取用户信息
 */
async function getUserInfo(accessToken) {
    return await fetch(GITLIB_URLS.USER_INFO, 'get', accessToken)
}

/**
 * @Description: 更新AccessToken
 */
async function updateAccessToken() {
    console.log('remove')
    return new Promise((resolve => {
        fs.remove(path.join(homedir, Secret), async (err) => {
            console.log('err', err)
            if (err === null) {
                // console.log('iiiiii', await getAccessToken(true))
                // return await getAccessToken(true)
                const token = await getAccessToken(true)
                resolve(token)
            }
        })
    }))
}

/**
 * @Description: 校验用户的token是否有效
 */
async function checkToken(user) {
    let userInfo, accessToken;
    const status = ['No Permission', 'Unauthorized']
    if (status.includes(user)) {
        accessToken = await updateAccessToken()
        userInfo = await getUserInfo(accessToken)
        if (status.includes(userInfo)) {
            return checkToken(userInfo)
        }
        return {
            accessToken, userInfo
        }
    }
}

async function setProjectOrigin(accessToken, gitName, widgetDir) {
    const remoteUrl = `https://oauth2:${accessToken}@github.com/${FILDER}/${gitName}.git`;
    const git = simpleGit(widgetDir) // 进入git路径
    await git.init()
        .addRemote('origin', remoteUrl)
}

module.exports = {
    getAccessToken,
    getProjectInfo,
    createProject,
    getUserInfo,
    checkToken,
    setProjectOrigin
}
