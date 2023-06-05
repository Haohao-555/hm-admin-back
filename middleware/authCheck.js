// 权限检查
const { ADMIN } = require('../config/auth')

module.exports = async (ctx, next) => {
  if (ADMIN == ctx.session.userInfo.authId) {
    await next()
  } else {
    ctx.body = {
      errorno: 8000,
      message: '权限不够'
    }
    return
  }
}