const { DEFAULT_PICTURE } = require('../constant/index')
const { timeFormat } = require('./dt')

/**
 * 格式化用户头像
 * @param {Object} obj 用户默认头像
 * @returns 格式化后的对象
 */
function _formatUserAvatar(obj) {
  if (obj.avatar == null || obj.avatar == "") {
    obj.avatar = DEFAULT_PICTURE
  }
  return obj
}

/**
 * 格式化博客的时间
 * @param {Object} obj 
 */
function _formatDBTime(obj) {
  obj.createdAtFormat = timeFormat(obj.createdAt)
  obj.updateAtFormat = timeFormat(obj.updatedAt)
  return obj
}

/**
 * 格式化用户信息
 * @param {Array | Object} list 用户列表或单个用户
 */
function formatUsers(list) {
  if (list == null) return
  
  if (list instanceof Array) {
    //数组 用户列表
    return list.map(_formatDBTime).map(_formatUserAvatar)
  }

  //单个对象
  return _formatUserAvatar(list)
}

module.exports ={
  formatUsers
}