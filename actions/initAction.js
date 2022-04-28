const path = require('path')
const cwd = require('../utils/getCwd')
const { outputJsonSync, readJsonSync } = require('fs-extra')
const isExist = require('../utils/isExist')
const configName = require('../config/configName')
function initAction () {
  if (isExist(cwd, configName)) {
    throw new Error('配置文件已存在')
  } else {
    // 还需进一步测试
    const obj = readJsonSync(path.resolve(path.dirname(__dirname), 'config', 'dq.config.default.json'))
    outputJsonSync(`./${configName}`, obj, { spaces: 2 })
  }
}
module.exports = initAction
