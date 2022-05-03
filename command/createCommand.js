const { program } = require('commander')
const { createAction } = require('../actions/index')
function createCommand() {
  program.command('create <project>').description('拉取模板创建项目').action(createAction)
}
module.exports = createCommand
