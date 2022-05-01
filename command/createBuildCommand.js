const { program } = require('commander')
const { buildAction } = require('../actions/index')
function createBuildCommand() {
  program
    .command('build')
    .description('将本地的指定文件夹部署到服务器')
    .option('-H --host [host]', '服务器ip,默认localhost')
    .option('-p --port [port]', '设置ssh连接的端口号,默认是22')
    .option('-u --user [username]', '服务器登录的用户名,默认root')
    .option('-k --privateKey [privateKey]', '私钥保存的位置,绝对路径')
    .option('-P --PWD [password]', '登录密码')
    .option('-l --local [localPath]', '要上传的文件夹的位置,默认是当前工作目录的dist文件夹')
    .option('-d --dest [destination]', '要上传的服务器的哪个目录下,必须使用绝对路径')
    .option('-c --config [config]', '选择配置文件的路径,默认当前工作目录下的dq.config.json文件')
    .option('-e --exec [command]', '上传文件之后在服务器中执行的命令')
    .action(async (...args) => {
      await buildAction(...args)
    })
}
module.exports = createBuildCommand
