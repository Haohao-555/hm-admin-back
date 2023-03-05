const User = require('./users/users')
const Auth = require('./auths/auths')

// 创建 User 的 auth 键 为外键，并关联 Auth 表
User.belongsTo(Auth, {
  // User 外键
  foreignKey: 'authId',
  // Auth 主键
  targetKey: 'authId'
})

module.exports = {
  User,
  Auth
}