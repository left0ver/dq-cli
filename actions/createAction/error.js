const chalk = require('chalk')
const error = chalk.bold.red
const info = chalk.hex('#FFA500')
// const warning = chalk.hex('#FFA500')
const ERROR_PROJECT_NAME_IS_ILLEGAL = () => {
  throw new Error(
    `[create] ${error('项目名不合法')},${info('必须以字母数字下划线开头,不能包含中文/.')}`
  )
}
const ERROR_PROJECT_IS_EXIST = () => {
  throw new Error(`[create] ${error('Project already exists')}`)
}
const ERROR_INSTALLWAY_NOT_EXIST = installWay => {
  const finalErrorMsg = `${installWay} is not exist;请先安装${installWay}`
  throw new Error(`[create] ${error(finalErrorMsg)}`)
}

module.exports = {
  ERROR_PROJECT_NAME_IS_ILLEGAL,
  ERROR_PROJECT_IS_EXIST,
  ERROR_INSTALLWAY_NOT_EXIST,
}
