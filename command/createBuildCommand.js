const { program } = require('commander')
function createBuildCommand () {
  program
    .command('build [source] [destination]')
    .description('将本地的指定文件夹上传到远程服务器的某个目录')
    .action((source, destination) => {
      console.log(source)
      console.log(destination)
    })
}
module.exports = createBuildCommand
