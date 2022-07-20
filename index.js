#!/usr/bin/env node
'use strict'
const { program } = require('commander')
const packageJSon = require('./package.json')
const { BuildCommand, initCommand, createCommand } = require('./command/index')
const showLogo = require('./utils/showLogo')

const version = packageJSon.version
const logo = showLogo('d q')
program.option('-V --version', '当前的版本').action(() => {
  console.log(logo)
  console.log(version)
})
program.on('--help', function () {
  console.log(logo)
})
initCommand()
BuildCommand()
createCommand()
program.parse(process.argv)
