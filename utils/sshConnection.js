'use strict'
const path = require('path')
const { NodeSSH } = require('node-ssh')
const cwd = require('../utils/getCwd')
const ssh = new NodeSSH()
function runCommand (command, cwd = '/') {
  return new Promise((resolve, reject) => {
    ssh.execCommand(command, { cwd })
      .then((res) => {
        resolve(res)
      })
      .catch((err) => reject(err))
  })
}
async function getFileStatus (root, name, isDir = true) {
  const { stdout } = isDir ? await runCommand(`find ${root} -type d -name ${name}`) : await runCommand(`find ${root} -type f -name ${name}`)
  return stdout !== ''
}
async function sshConnect ({
  host,
  username,
  port,
  password,
  privateKey,
  localPath,
  remotePath,
  os
}) {
  // 在客户端生成密钥对，将公钥复制添加到云服务器上的/root/.ssh/目录下
  // 看一下该目录下有没有authorized_keys,没有的话手动创建一个,
  // 之后将复制的公钥的文件的内容追加到authorized_keys
  // 例如: cat id_rsa_client.pub >> authorized_keys
  // id_rsa_client.pub 是公钥的内容
  return new Promise(function (resolve, reject) {
    ssh.connect({
      host,
      username,
      port,
      password,
      privateKey
    })
      .then(async res => {
        //   本地地址,远程地址
        const localFullPath = path.isAbsolute(localPath)
          ? localPath
          : path.resolve(cwd, localPath)
        let remoteFullPath
        // Windows和Linux上对应不同的路径
        if (os.toLowerCase() === 'linux') {
          remoteFullPath = path.isAbsolute(localPath)
            ? path.posix.resolve(remotePath, path.basename(localPath))
            : path.posix.resolve(remotePath, localPath)
        } else {
          remoteFullPath = path.isAbsolute(localPath)
            ? path.win32.resolve(remotePath, path.basename(localPath))
            : path.win32.resolve(remotePath, localPath)
        }
        const basename = path.basename(remoteFullPath)
        const MainIsExist = await getFileStatus(remotePath, basename, true)
        if (MainIsExist) {
          // 备份目录
          const bakDir = os.toLowerCase() === 'linux'
            ? path.posix.resolve(remotePath, path.basename(remoteFullPath) + '1')
            : path.win32.resolve(remotePath, path.basename(remoteFullPath) + '1')
          // 备份目录的状态
          const banIsExist = await getFileStatus(bakDir, basename + 1, true)
          if (banIsExist) {
            // 删除原先备份目录
            await runCommand(`rm -rf ${bakDir}`)
          }
          await runCommand(`mv ${remoteFullPath} ${bakDir}`)
        }
        try {
          const isSuccess = await ssh.putDirectory(localFullPath, remoteFullPath, {
            recursive: true,
            concurrency: 10,
            validate: function (itemPath) {
              const baseName = path.basename(itemPath)
              return baseName !== 'node_modules' // 不上传node_modules文件夹和隐藏文件
            }
          })
          // 成功部署
          if (isSuccess) {
            resolve('success')
          }
        } catch (err) {
          reject(err)
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}
module.exports = sshConnect
