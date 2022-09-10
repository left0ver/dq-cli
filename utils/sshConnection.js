'use strict'
const path = require('path')
const fs = require('fs-extra')
const ProgressBar = require('progress')
const ora = require('ora')
const { NodeSSH } = require('node-ssh')
const cwd = require('../utils/getCwd')
const archiver = require('archiver')
const spinner = ora()
const ssh = new NodeSSH()

const State = {
  uploadSuccess: '上传成功',
  uploadFailure: '上传失败',
  deploying: '部署中',
  endDeploy: '部署完成',
  connectFailure: '连接失败',
}
const compressType = '.tar.gz'
const bakType = '.bak'
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
  const CompressState = {
    startCompress: '开始压缩',
    compressFailure: '压缩失败',
    compressCompleted: '压缩完成',
  }
  return new Promise((resolve, reject) => {
    const archive = archiver('tar', {
      gzip:true,
      gzipOptions:{
        level:9
      }
    })
    const output = fs.createWriteStream(zipDirPath)
    archive.on('error', function (err) {
      spinner.fail(CompressState.compressFailure)
      throw err
    })
    output.on('close', function () {
      resolve(archive.pointer())
      spinner.succeed(CompressState.compressCompleted)
    })
    output.on('open', function () {
      spinner.start(CompressState.startCompress)
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
    width: 50,
    complete: '=',
    incomplete: ' ',
  })
  return bar
}
// 备份
async function backUp(basename, cwd) {
  // 备份目录
  const bakDir = basename + bakType
  const bakIsExist = await getFileStatus(bakDir, true, cwd)
  if (bakIsExist) {
    // 删除原来的备份目录
    await runCommand(`rm -rf ${bakDir}`, cwd)
  }
  await runCommand(`mv ${basename} ${bakDir}`, cwd)
}
async function sshConnect({
  host,
  username,
  port,
  password,
  privateKey,
  localPath,
  remotePath,
  command,
}) {
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
        const compressBasename = basename + compressType
        const localZipPath = path.resolve(process.cwd(), compressBasename)
        // 解压之前的路径
        const zipRemoteFullPath = path.posix.resolve(remotePath, compressBasename)

        // 部署
        async function deploy() {
          const MainIsExist = await getFileStatus(basename, true, remotePath)
          if (MainIsExist) {
            await backUp(basename, remotePath)
          }
          await runCommand(
            `mkdir ${basename} && tar -zxvf ${compressBasename} -C ${basename} && rm -rf ${compressBasename}`,
            remotePath
          )
          if (command !== undefined) {
            await runCommand(command)
          }
          fs.removeSync(localZipPath)
        }

        // 上传
        try {
          if (!fs.existsSync(localFullPath)) {
            throw new Error(`localPath:${localFullPath}不存在`)
          }

          if (!(await getFileStatus(path.basename(remotePath), true, path.dirname(remotePath)))) {
            throw new Error(`remotePath:${remotePath}不存在`)
          }
          fs.existsSync(localZipPath) && fs.removeSync(localZipPath)
          const total = await compress(localFullPath, localZipPath)
          // 进度条
          const bar = upload(total)
          await ssh.putFile(localZipPath, zipRemoteFullPath, null, {
            step: (total_transferred, chunk, total) => {
              bar.tick(chunk)
              if (total_transferred === total) {
                spinner.succeed(State.uploadSuccess)
              }
            },
          })
          spinner.start(State.deploying)
          await deploy()
          // 成功部署
          resolve(State.endDeploy)
          spinner.succeed(State.endDeploy)
        } catch (err) {
          spinner.fail(State.uploadFailure)
          reject(err)
        }
      })
      .catch(err => {
        spinner.fail(State.connectFailure)
        reject(err)
      })
      .finally(() => {
        ssh.dispose()
      })
  })
}
module.exports = sshConnect
