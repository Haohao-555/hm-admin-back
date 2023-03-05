const xss = require('xss')
const { User, Auth } = require('../../db/module/index')
const { formatUsers } = require('../../util/formateData')

// 查找用户
const findUser = async ({ where = {} } = {}) => {
  const result = await User.findOne({
    attributes: [
      'id',
      'account',
      'nickName',
      'authId',
      'gender',
      'age',
      'idcard',
      'city',
      'email',
      'state',
      'avatar',
      'intriduce'
    ],
    include: [
      {
        model: Auth,
        attributes: ['permission']
      }
    ],
    where
  })
  if (!result) return {}

  let userInfo = formatUsers(result.dataValues)
  userInfo.auth = userInfo.auth.dataValues.permission.split("&")
  return userInfo
}

// 查找指定页数及页大小的用户
const findAllUser = async ({ pageIndex = 0, pageSize = 5, where = {} } = {}) => {
  console.log('pageSize', pageSize, 'pageIndex', pageIndex)
  const res = await User.findAndCountAll({
    limit: pageSize, //每一页的跳数
    offset: pageSize * pageIndex, //跳过多少条
    order: [
      ['id', 'asc']
    ],
    // 副表
    include: [
      {
        model: Auth,
        attributes: ['permission']
      }
    ],
    where
  })
  let userList = formatUsers(res.rows.map(row => row.dataValues))
  userList = userList.map(userItem => {
    const auth = userItem.auth.dataValues.permission.split("&")
    userItem.auth = auth
    return userItem
  })
  return {
    count: res.count,
    userList
  }
}

// 创建用户
const createUser = async ({ userList } = {}) => {
  let res = []
  for (let i = 0; i < userList.length; i++) {
    const { dataValues } = await User.create(userList[i])
    res.push(dataValues)
  }
  return {
    flag: res.length == userList.length,
    createUser: res
  }
}

// 删除用户
const deleteUser = async ({ whereUserList } = {}) => {
  const res = [];
  for (let i = 0; i < whereUserList.length; i++) {
    const where = whereUserList[i]
    const result = await User.destroy({ where })
    if (result > 0) res.push(where);
  }
  return {
    flag: res.length == whereUserList.length,
    deleteData: res
  }
}

// 更新用户
const updateUser = async ({ whereUserList } = {}) => {
  let res = []
  for (let i = 0; i < whereUserList.length; i++) {
    const { data, where } = whereUserList[i]
    const result = await User.update(data, { where })
    if (result[0] > 0) res.push(whereUserList[i])
  }
  return {
    flag: res.length == whereUserList.length,
    updateUser: res
  }
}

module.exports = {
  findUser,
  findAllUser,
  createUser,
  deleteUser,
  updateUser
}


// (async () => {
//   const res = await findAllUser()
//   console.log(res.userList)
// })()
