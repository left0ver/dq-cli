const process = require('process')
const { resolve } = require('path')
const { existsSync } = require('fs-extra')
function isExist(cwd = process.cwd(), filename) {
  return existsSync(resolve(cwd, filename))
}
module.exports = isExist
