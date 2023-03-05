const Mock = require('mockjs')
const { User, Auth } = require('../module/index')
const {
  SUPPER_ADMID,
  SUPPER_ADMID_PERMISSION,
  ADMIN,
  ADMIN_PERMISSION,
  USER,
  USER_PERMISSION
} = require('../../config/auth')


const initAuthData = async () => {

  // 超级管理员
  const superAdminData = await Auth.create({
    authId: SUPPER_ADMID,
    permission: SUPPER_ADMID_PERMISSION.join('&')
  })

  // 普通管理员
  const adminData = await Auth.create({
    authId: ADMIN,
    permission: ADMIN_PERMISSION.join('&')
  })

  // 用户
  const userData = await Auth.create({
    authId: USER,
    permission: USER_PERMISSION.join('&')
  })
}

const Random = Mock.Random
const initUsersData = async () => {
  for (let i = 0; i < 20; i++) {
    const firstName = Random.cfirst()
    const user = {
      account: Random.string('0123456789', 3, 5),
      password: Random.string('0123456789', 3, 5),
      nickName: firstName + Random.clast(),
      authId: Random.string('012', 1, 1),
      gender: Random.string('123', 1, 1),
      age: Random.integer(18, 30),
      idcard: Random.id(),
      city: Random.city(true),
      email: Random.email(),
      state: Random.boolean(9, 2, true),
      avatar: Random.image('60x60', '#de4307', '#ffffff', firstName),
      intriduce: Random.csentence(12, 18)
    }
    await User.create(user)
  }
}

module.exports = {
  initAuthData,
  initUsersData
}