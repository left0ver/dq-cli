const { existsSync } = require('fs')
const path = require('path')
const cwd = require('../utils/getCwd')
const sshConnect = require('../utils/sshConnection')
const mergeConfig = require('../utils/mergeConfig')
const defaultConfig = require('../config/dq.config.default.json')
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
    //  最终配置
    let finalConfig
    // 判断用户有没有配置文件
    const userConfigPath = path.resolve(cwd, 'dq.config.json')
    const isExist = existsSync(userConfigPath)
    if (isExist) {
      const userConfig = require(userConfigPath)
      // 合并本地的配置文件和默认的配置
      const midConfig = mergeConfig(defaultConfig, userConfig)
      //   合并命令行输入的配置和上述合并之后的配置
      finalConfig = mergeConfig(midConfig, inputConfig)
    } else {
      // 合并默认配置和命令行配置
      finalConfig = mergeConfig(defaultConfig, inputConfig)
    }
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
