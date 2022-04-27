#!/usr/bin/env node
'use strict'
const { program } = require('commander')
const packageJSon = require('./package.json')
const { createBuildCommand } = require('./command/index')
const version = packageJSon.version
program.version(version)
createBuildCommand()
program.parse(process.argv)
