const { program } = require('commander')
const buildAction = require('../actions/buildAction')
function createBuildCommand () {
  program
    .command('build')
    .description('将本地的指定文件夹部署到服务器')
    .option('-H --host [host]', '上传的服务器ip')
    .option('-p --port [port]', '设置ssh连接的端口号,默认是22')
    .option('-u --user [username]', '服务器登录的用户名')
    .option('-k --privateKey [privateKey]', '私钥保存的位置')
    .option('-P --PWD [password]', '登录密码')
    .option('-l --local [localPath]', '要上传的文件夹的位置,默认是当前工作目录的dist文件夹')
    .option('-d --dest [destination]', '要上传的服务器的哪个目录下')
    .option('-o --os [os]', '服务器的操作系统(只支持windows和linux)')
    .action((...args) => {
      buildAction(...args).then(res => {
        console.log(res)
      })
    })
}
module.exports = createBuildCommand
