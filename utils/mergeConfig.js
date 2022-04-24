// 获得完整的配置
function mergeConfig (defaultConfig, userConfig) {
  for (const key in defaultConfig) {
    if (Object.hasOwnProperty.call(defaultConfig, key)) {
      userConfig[key] = userConfig[key] || defaultConfig[key]
    }
  }
  return userConfig
}
module.exports = mergeConfig
