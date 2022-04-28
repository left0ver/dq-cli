const { existsSync } = require('fs')
const path = require('path')
const cwd = require('../utils/getCwd')
const sshConnect = require('../utils/sshConnection')
const mergeConfig = require('../utils/mergeConfig')
const defaultConfig = require('../config/dq.config.default.json')
const configName = require('../config/configName')
function buildAction (options) {
  // 命令行输入的配置
  const inputConfig = {
    host: options.host,
    username: options.user,
    port: options.port,
    password: options.PWD,
    privateKey: options.privateKey,
    localPath: options.local,
    remotePath: options.dest,
    os: options.os
  }
  return new Promise((resolve, reject) => {
    let finalConfig
    let userConfigPath
    if (options.config === true) {
      throw new Error('缺少对应的配置文件的路径')
    } else if (options.config !== undefined) {
      // 用户指定路径的配置文件
      userConfigPath = path.isAbsolute(options.config) ? path.resolve(cwd, path.basename(options.config)) : path.resolve(cwd, options.config)
    } else {
      // 用户没有配置文件
      userConfigPath = path.resolve(cwd, configName)
    }
    const isExist = existsSync(userConfigPath)
    if (isExist) {
      const userConfig = require(userConfigPath)
      // 合并本地的配置文件和默认的配置
      const midConfig = mergeConfig(defaultConfig, userConfig)
      //   合并命令行输入的配置和上述合并之后的配置
      finalConfig = mergeConfig(midConfig, inputConfig)
    } else {
      // 没有配置文件则会合并默认配置和命令行输入的配置
      finalConfig = mergeConfig(defaultConfig, inputConfig)
    }
    // if (process.env.NODE_ENV === 'development') {

    // }
    console.log(finalConfig)
    sshConnect(finalConfig)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}
module.exports = buildAction
