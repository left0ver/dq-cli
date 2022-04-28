const { program } = require('commander')
const { initAction } = require('../actions/index')
function initCommand () {
  program
    .command('init')
    .description('初始化配置文件')
    .action(() => {
      initAction()
    })
}
module.exports = initCommand
