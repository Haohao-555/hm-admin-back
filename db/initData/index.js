const Mock = require('mockjs')
const { User, Auth } = require('../module/index')
const {
  ADMIN,
  ADMIN_PERMISSION,
  USER,
  USER_PERMISSION
} = require('../../config/auth')
const { AVATAR_ADDRESS } = require('../../constant/index')


const initAuthData = async () => {

  // 管理员
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
  // 用户
  const user = {
    account: 'user',
    password: '123456',
    nickName: 'user',
    authId: '0',
    gender: Random.string('12', 1, 1),
    age: Random.integer(18, 30),
    idcard: Random.id(),
    city: Random.city(true),
    email: Random.email(),
    state: Random.boolean(9, 2, true),
    avatar: `${AVATAR_ADDRESS}ava (${Random.integer(1, 10)}).jpg`,
    intriduce: '用尽一切奔向你'
  }

  // 管理员
  const admin = {
    account: 'admin',
    password: '123456',
    nickName: 'admin',
    authId: '1',
    gender: Random.string('12', 1, 1),
    age: Random.integer(18, 30),
    idcard: Random.id(),
    city: Random.city(true),
    email: Random.email(),
    state: Random.boolean(9, 2, true),
    avatar: `${AVATAR_ADDRESS}ava (${Random.integer(1, 10)}).jpg`,
    intriduce: '心之所向，才能持之以恒'
  }
  User.create(user)
  User.create(admin)

  for (let i = 0; i < 210; i++) {
    const authId = Random.string('01', 1, 1)
    const obj = {
      account: Random.string('0123456789', 6, 6),
      password: Random.string('0123456789', 6, 6),
      nickName: Random.cfirst() + Random.clast(),
      authId: authId,
      gender: Random.string('123', 1, 1),
      age: Random.integer(18, 30),
      idcard: Random.id(),
      city: Random.city(true),
      email: Random.email(),
      state: Random.boolean(9, 2, true),
      avatar: `${AVATAR_ADDRESS}ava (${Random.integer(1, 10)}).jpg`,
      intriduce: Random.csentence(12, 18)
    }
    await User.create(obj)
  }
}

module.exports = {
  initAuthData,
  initUsersData
}
