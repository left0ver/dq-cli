const figlet = require('figlet')
const chalk = require('chalk')

function showLogo(text) {
  return chalk.yellow(
    figlet.textSync(text, {
      font: 'Larry 3D',
      horizontalLayout: 'universal smushing',
      verticalLayout: 'controlled smushing',
      width: 80,
      whitespaceBreak: true,
    })
  )
}

module.exports = showLogo
