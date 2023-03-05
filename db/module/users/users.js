const seq = require('../../seq')
const { STRING, INTEGER, BOOLEAN, TEXT } = require('../type')
const { DEFAULT_avatar } = require('../../../constant/index')
// 创建 User 类
const User = seq.define('user', {
  account: {
    type: STRING,
    allowNull: false,
    unique: true, //是否唯一
    comment: '用户名，唯一'
  },
  password: {
    type: STRING,
    allowNull: false,
    comment: '密码'
  },
  nickName: {
    type: STRING,
    allowNull: true,
    comment: '昵称'
  },
  authId: {
    type: STRING,
    allowNull: false,
    defaultValue: '0',
    comment: '权限值（0：普通用户；1：管理员；2：超级管理员）'
  },
  gender: {
    type: STRING,
    allowNull: false,
    defaultValue: '3', //默认值为 3
    comment: '性别（1男性，2女性，3保密）'
  },
  age: {
    type: INTEGER,
    allowNull: false,
    defaultValue: '18',
    comment: '年龄',
  },
  idcard: {
    type: STRING,
    allowNull: false,
    defaultValue: '111111111111111111',
    comment: '身份证'
  },
  city: {
    type: STRING,
    allowNull: false,
    defaultValue: '汕头',
    comment: '城市'
  },
  email: {
    type: STRING,
    allowNull: false,
    defaultValue: '3283627490@qq.com',
    comment: '邮箱地址'
  },
  state: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: '用户状态'
  },
  avatar: {
    type: STRING,
    allowNull: false,
    defaultValue: DEFAULT_avatar,
    comment: '头像'
  },
  intriduce: {
    type: TEXT,
    allowNull: false,
    defaultValue: '这个人很懒，没有自己的介绍',
    comment: '描述信息'
  }
})
module.exports = User