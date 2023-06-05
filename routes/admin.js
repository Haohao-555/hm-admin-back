const router = require('koa-router')()
const loginCheck = require('../middleware/loginCheck')
const authCheck = require('../middleware/authCheck')
const { ADMIN, USER } = require('../config/auth')
const { checkAuth } = require('../util/checkAuth')
const { searchUser, addUser, changeUserInfo, getUserList, changeUserAuth } = require('../controller/users/index')
// 管理员特有的接口
router.prefix('/adminApi/admin')

// *创建用户
router.post('/createuser', loginCheck, async (ctx, next) => {
  const { account = '-', password = '123456' } = ctx.request.body
  const result = await searchUser({ where: { account } })
  if (result.account == account) {
    ctx.body = {
      errorno: 4002,
      message: '账号必须唯一'
    }
    return
  } else {
    const Random = Mock.Random
    const userList = [{
      account: account,
      password: password,
      nickName: 'QZ-Admin',
      authId: '0',
      gender: '3',
      age: 18,
      idcard: 334243199905292015,
      city: Random.city(true),
      email: Random.email(),
      state: true,
      avatar: Random.image('120x120', '#000000', '#ffffff', 'Z'),
      intriduce: Random.csentence(12, 18)
    }]
    const result = await addUser({ userList })
    if (!result.flag) {
      ctx.body = {
        errorno: 4003,
        message: '用户注册失败'
      }
      return
    }

    ctx.body = {
      errorno: 0,
      message: '注册成功（部分数据项系统默认生成）',
      data: result.res[0]
    }
  }
})

//*查看用户列表
router.post('/list', loginCheck, authCheck, async (ctx, next) => {
  const { pageSize = 5, pageIndex = 0, where = {} } = ctx.request.body
  const userList = await getUserList({
    pageSize: parseInt(pageSize),
    pageIndex: parseInt(pageIndex),
    where
  })
  ctx.body = {
    errorno: 0,
    message: '获取用户列表成功',
    data: userList
  }
})

// *修改用户身份
router.post('/changeAuth', loginCheck, authCheck, async (ctx, next) => {

  // TODO 获取 session 中的 权限 ID（auth）及 账号 ID （id）
  const sessionAccountId = ctx.session.userInfo.id
  let { accountId, authId = '0' } = ctx.request.body

  if (accountId == sessionAccountId) { // !被修改身份为管理员
    ctx.body = {
      errorno: 5001,
      message: '管理员不能修改自己的权限'
    }
    return
  } else { // !被修改的身份为普通用户
    if (checkAuth(authId)) { // 判断权限值是否合法
      authId += ''
      const result = await changeUserAuth({
        whereUserList: [{
          where: { id: accountId },
          data: { authId: authId }
        }]
      })

      if (!result.flag) {
        ctx.body = {
          errorno: 5002,
          message: '修改用户权限失败',
        }
        return
      }

      ctx.body = {
        errorno: 0,
        message: '修改用户权限成功'
      }

    } else { // 权限值非法
      const message = ` ${ADMIN}:管理员; ${USER}:普通用户`
      ctx.body = {
        errorno: 5003,
        message: `修改权限身份值不正确 (${message})`
      }
    }
  }

})

// *切换用户状态
router.post('/switchState', loginCheck, authCheck, async (ctc, next) => {
  let { state = true, accountId = 0 } = ctx.request.body
  const result = await changeUserAuth({
    whereUserList: [{
      where: { id: accountId },
      data: { state: authId }
    }]
  })

  if (!result.flag) {
    ctx.body = {
      errorno: 5004,
      message: '修改状态失败',
    }
    return
  }

  ctx.body = {
    errorno: 0,
    message: '修改状态成功'
  }
})

// *修改用户信息
router.post('/changeUserInfo', loginCheck, authCheck, async (ctx, next) => {
  const { accountId = 0, nickName = '', gender = '3', age = 18, idcard = '', city = '', email = '', intriduce = '' } = ctx.request.body
  // TODO 获取 session 中的账号（id）
  const id = ctx.session.userInfo.id
  if (id == accountId) {
    ctx.body = {
      errorno: 4008,
      message: '接口地址不正确'
    }
    return
  }
  const whereUserList = [
    {
      where: { id: accountId },
      data: {
        nickName,
        gender,
        age,
        idcard,
        city,
        email,
        intriduce
      }
    }
  ]
  const result = await changeUserInfo({ whereUserList })
  if (!result.flag) {
    ctx.body = {
      errorno: 4004,
      message: '更新用户信息失败'
    }
    return
  }

  ctx.body = {
    errorno: 0,
    message: '更新用户信息成功'
  }
})

module.exports = router