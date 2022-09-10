const { promisify } = require('util')
const fs = require('fs-extra')
const path = require('path')
const download = promisify(require('download-git-repo'))
const inquirer = require('inquirer')
const ora = require('ora')
const chalk = require('chalk')
const kebabCase = require('kebab-case')
const cwd = require('../../utils/getCwd')
const execCommand = require('../../utils/execCommand')
const {
  ERROR_PROJECT_NAME_IS_ILLEGAL,
  ERROR_PROJECT_IS_EXIST,
  ERROR_INSTALLWAY_NOT_EXIST,
} = require('./error')
const spinner = ora()

const info = chalk.yellow
const templateTypes = ['node-less-template', 'vue3-pinia-ts-template']
const installWays = ['npm', 'yarn']

function handleProjectName(project) {
  project = project.trim().replace(/\//g, '_')
  return project
}

function validateProjectName(project) {
  /*
        以数字字母下划线开头,不能有中文和.
    */
  const regex = /^[a-zA-Z0-9_][^\u4e00-\u9fa5. ]+/g
  const matchResult = project.match(regex)
  return matchResult !== null && matchResult[0].length === project.length
}

function getDownAddress(templateType) {
  return `github:dq-cli-template/${templateType}#main`
}

//修改项目中package.json的name
function changePackageName(packageJsonPath, projectName) {
  const packageJsonData = fs.readFileSync(packageJsonPath)
  const temp = JSON.parse(packageJsonData.toString())
  // 将项目名转成kebab-case的形式
  temp.name = kebabCase(projectName)
  fs.writeFileSync(packageJsonPath, JSON.stringify(temp, null, 2))
}

async function createAction(project) {
  const projectName = handleProjectName(project)
  if (!validateProjectName(projectName)) {
    // 不合法的项目名。。。
    ERROR_PROJECT_NAME_IS_ILLEGAL()
  }
  const projectPath = path.resolve(cwd, projectName)
  const isExist = fs.pathExistsSync(projectPath)
  //    项目已存在
  if (isExist) {
    ERROR_PROJECT_IS_EXIST()
  }
  const { templateType, installWay } = await inquirer.prompt([
    {
      type: 'list',
      name: 'templateType',
      message: '请选择您想要的模板',
      default: 'node-less-template',
      choices: templateTypes,
      prefix: '🚀',
    },
    {
      type: 'list',
      name: 'installWay',
      message: '您想使用哪个工具安装依赖',
      default: 'npm',
      choices: installWays,
      prefix: '🛠️',
    },
  ])
  spinner.prefixText = '🚀', 
  spinner.color = 'green'
  spinner.start('下载中...')
  try {
    await download(getDownAddress(templateType), projectName, { clone: true })
  } catch (error) {
    spinner.fail('[create]下载模板失败,请重试（可能是网络原因）')
    throw new Error(chalk.red.bold(error))
  }
  spinner.stop()
  try {
    await execCommand(`${installWay} -v`, { cwd: projectPath, stdio: 'inherit' })
  } catch (error) {
    ERROR_INSTALLWAY_NOT_EXIST(installWay)
  }
  try {
    await execCommand(`git init && ${installWay} install && npx husky install`, {
      cwd: projectPath,
      stdio: 'inherit',
    })
  } catch (error) {
    throw new Error(chalk.red.bold(error))
  }
  const packageJsonPath = path.resolve(projectPath, 'package.json')
  changePackageName(packageJsonPath, projectName)
  // stdio: 'inherit' 子进程通过相应的标准输入输出流传入/传出父进程，这样可以显示出安装过程
  console.log(`${info('    cd ')}${info(projectName)}`)
}
module.exports = createAction
