const { findUser, createUser, findAllUser, updateUser } = require('../../services/users/users')


// 查找用户
const searchUser = async ({ where = {} } = {}) => {
    const result = await findUser({ where })
    return result
}

// 增加用户
const addUser = async ({ userList = [] } = {}) => {
    const result = await createUser({ userList })
    return result
}

// 查找用户列表
const getUserList = async ({ pageIndex = 0, pageSize = 5, where = {} } = {}) => {
    let result = await findAllUser({ pageIndex, pageSize, where })
    return result
}

// 修改用户信息
const changeUserInfo = async ({ whereUserList = [] } = {}) => {
    const result = await updateUser({ whereUserList })
    return result
}

// 修改用户权限
const changeUserAuth = async ({ whereUserList = [] } = {}) => {
    const result = await updateUser({ whereUserList })
    return result
}

// 获取用户信息
const getUserInfo = async ({ id = -1 } = {}) => {
    const result = await findUser({
        where: { id }
    })
    return result
}

// 修改密码
const changePw = async ({ whereUserList = [] } = {}) => {
    const result = await updateUser({ whereUserList })
    return result
}

module.exports = {
    searchUser,
    addUser,
    changeUserInfo,
    changeUserAuth,
    getUserList,
    getUserInfo,
    changePw
}