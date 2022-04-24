'use strict'
const path = require('path')
const { NodeSSH } = require('node-ssh')
const cwd = require('../utils/getCwd')
const ssh = new NodeSSH()
async function sshConnect ({
  host,
  username,
  port,
  password,
  privateKey,
  localPath,
  remotePath
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
        const remoteFullPath = path.isAbsolute(localPath)
          ? path.join(remotePath, path.basename(localPath))
          : path.join(remotePath, localPath)

        try {
          const isSuccess = await ssh.putDirectory(localFullPath, remoteFullPath, {
            recursive: true,
            concurrency: 10,
            validate: function (itemPath) {
              const baseName = path.basename(itemPath)
              return baseName.slice(0, 1) !== '.' && // 不允许隐藏文件
                         baseName !== 'node_modules' // 不上传node_modules文件夹
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
