const seq = require('../../seq')
const { STRING, INTEGER, BOOLEAN } = require('../type')

// 创建 Auth 类
const Auth = seq.define('auth', {
  authId: {
    type: STRING,
    allowNull: false,
    unique: true, 
    comment: '权限值',
    defaultValue: '0',
    comment: '权限值（0：普通用户；1：管理员；2：超级管理员）'
  },
  permission: {
    type: STRING,
    allowNull: false,
    defaultValue: 'usermanage&userrole', //默认值为 3
    comment: '权限值'
  }
})
module.exports = Auth

/**
 * usermanage
 * userrole
 * tabletree
 * tablehook
 * componentguide
 * componenticon
 * componenteditor
 * componentmarkdown
 * chartline
 */