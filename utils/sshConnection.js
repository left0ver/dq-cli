'use strict'
const path = require('path')
const fs = require('fs-extra')
const ProgressBar = require('progress')
const { NodeSSH } = require('node-ssh')
const ora = require('ora')
const cwd = require('../utils/getCwd')
const archiver = require('archiver')
const spinner = ora()
const ssh = new NodeSSH()
// 在远程服务器执行某个命令
function runCommand(command, cwd = '/') {
  return new Promise((resolve, reject) => {
    ssh
      .execCommand(command, { cwd })
      .then(res => {
        resolve(res)
      })
      .catch(err => reject(err))
  })
}
// 判断文件和目录是否存在
async function getFileStatus(name, isDir = true, cwd = '/') {
  const { stdout } = isDir
    ? await runCommand(`find -type d -name ${name}`, cwd)
    : await runCommand(`find  -type f -name ${name}`, cwd)
  return stdout !== ''
}
// 压缩
function compress(unZipDirPath, zipDirPath) {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', {
      zlib: { level: 9 },
    })
    const output = fs.createWriteStream(zipDirPath)
    archive.on('error', function (err) {
      spinner.fail('压缩失败')
      throw err
    })
    output.on('close', function () {
      resolve(archive.pointer())
      spinner.succeed('压缩完成')
    })
    output.on('open', function () {
      spinner.start('开始压缩')
    })
    try {
      archive.pipe(output)
      archive.directory(unZipDirPath, false)
      archive.finalize()
    } catch (error) {
      reject(error)
    }
  })
}
// 上传进度条
function upload(total) {
  const bar = new ProgressBar('upload [:bar] :percent ', {
    total,
    width: 200,
    complete: '=',
    incomplete: ' ',
  })
  return bar
}
// 备份
async function backUp(basename, cwd) {
  // 备份目录
  const bakDir = basename + '.bak'
  // 备份目录的状态
  const bakIsExist = await getFileStatus(basename + '.bak', true, cwd)
  if (bakIsExist) {
    // 删除原先备份目录
    await runCommand(`rm -rf ${bakDir}`, cwd)
  }
  await runCommand(`mv ${basename} ${bakDir}`, cwd)
}

async function sshConnect({ host, username, port, password, privateKey, localPath, remotePath }) {
  // 在客户端生成密钥对，将公钥复制添加到云服务器上的/root/.ssh/目录下
  // 看一下该目录下有没有authorized_keys,没有的话手动创建一个,
  // 之后将复制的公钥的文件的内容追加到authorized_keys
  // 例如: cat id_rsa_client.pub >> authorized_keys
  // id_rsa_client.pub 是公钥的内容
  return new Promise(function (resolve, reject) {
    ssh
      .connect({
        host,
        username,
        port,
        password,
        privateKey,
      })
      .then(async () => {
        //   本地地址
        const localFullPath = path.isAbsolute(localPath) ? localPath : path.resolve(cwd, localPath)

        const basename = path.basename(localFullPath)
        const localZipPath = path.resolve(process.cwd(), basename + '.zip')
        // 解压之前的路径
        const zipRemoteFullPath = path.posix.resolve(remotePath, basename + '.zip')
        // 上传
        try {
          if (!fs.existsSync(localFullPath)) {
            throw new Error(`${localFullPath}文件不存在`)
          }
          fs.existsSync(localZipPath) && fs.removeSync(localZipPath)
          const total = await compress(localFullPath, localZipPath)
          // 进度条
          const bar = upload(total)
          await ssh.putFile(localZipPath, zipRemoteFullPath, null, {
            step: (total_transferred, chunk, total) => {
              bar.tick(chunk)
              if (total_transferred === total) {
                spinner.succeed('上传成功')
              }
            },
          })
          spinner.start('部署中')
          const MainIsExist = await getFileStatus(basename, true, remotePath)
          if (MainIsExist) {
            await backUp(basename, remotePath)
          }
          await runCommand(`unzip ${basename}.zip -d dist && rm -rf ${basename}.zip`, remotePath)
          fs.removeSync(localZipPath)
          // 成功部署
          resolve('部署完成')
          spinner.succeed('部署完成')
        } catch (err) {
          reject(err)
          spinner.fail('上传失败')
        }
      })
      .catch(err => {
        spinner.fail('连接失败')
        reject(err)
      })
      .finally(() => {
        ssh.dispose()
      })
  })
}
module.exports = sshConnect
