const { execSync } = require('child_process')
function execCommand(...args) {
  return new Promise(function (resolve, reject) {
    try {
      execSync(...args)
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}
module.exports = execCommand
