#!/usr/bin/env node
'use strict'
const { program } = require('commander')
const packageJSon = require('./package.json')
const { BuildCommand, initCommand, createCommand } = require('./command/index')
const figlet = require('figlet')
const chalk = require('chalk')
const version = packageJSon.version
program.version(version).action(() => {})
initCommand()
BuildCommand()
createCommand()
program.parse(process.argv)
const logo = chalk.yellow(
  figlet.textSync('d q - c l i', {
    horizontalLayout: 'universal smushing',
    verticalLayout: 'controlled smushing',
    width: 120,
    whitespaceBreak: true,
  })
)
console.log(logo)
