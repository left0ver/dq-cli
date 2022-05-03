#!/usr/bin/env node
'use strict'
const { program } = require('commander')
const packageJSon = require('./package.json')
const { BuildCommand, initCommand, createCommand } = require('./command/index')
const version = packageJSon.version
program.version(version)
initCommand()
BuildCommand()
createCommand()
program.parse(process.argv)
