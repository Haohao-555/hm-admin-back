const xss = require('xss')
const { escape, exec } = require('../../db/mysql')

// 查找用户
const findUser = async ({ account, password }) => {
    account = escape(xss(account))
    password = escape(xss(password))

    let sql = `select * from users where account=${account} and password=${password}`
    const row = await exec(sql);
    return row[0] || {};
}

const findAccount = async ({ account }) => {
    account = escape(xss(account))
    let sql = `select * from users where account=${account}`
    const row = await exec(sql);
    return row[0] ? true : false
}

// 增加用户
const addUser = async ({ account, password, introduce, name, auth = '0' }) => {
    account = escape(xss(account))
    password = escape(xss(password))
    introduce = escape(xss(introduce))
    name = escape(xss(name))
    auth = escape(xss(auth))

    let sql = `insert into users (account, password, auth, introduce, name) 
               values (${account}, ${password}, ${auth}, ${introduce}, ${name})`
    const insertData = await exec(sql)
    return insertData.insertId > 0
}

// 查找用户列表
const getUserList = async () => {
    let sql = `select * from users`;
    return await exec(sql);
}

// 修改用户信息
const updateUser = async ({ accountId, introduce, name, account }) => {
    accountId = escape(xss(accountId))
    account = escape(xss(account))
    introduce = escape(xss(introduce))
    name = escape(xss(name))

    let sql = `update users set introduce=${introduce}, name=${name} where id=${accountId} and account=${account}`
    const updateData = await exec(sql)
    return updateData.affectedRows > 0
}

// 修改用户权限
const changeUserAuth = async ({ accountId, auth }) => {
    accountId = escape(xss(accountId))
    auth = escape(xss(auth))

    let sql = `update users set auth=${auth} where id=${accountId}`
    const updateData = await exec(sql)
    return updateData.affectedRows > 0
}

// 获取用户信息
const getUserInfo = async ({ id }) => {
    let sql = `select * from users where id=${id}`
    const row = await exec(sql);
    return row[0] || {}
}

// 修改密码
const changePw = async ({ oldpw, newpw, id, account }) => {
    oldpw = escape(xss(oldpw))
    newpw = escape(xss(newpw))
    let sql = `update users set password=${newpw} where password=${oldpw} and id=${id} and account='${account}'`
    const updateData = await exec(sql)
    return updateData.affectedRows > 0
}

module.exports = {
    findUser,
    findAccount,
    addUser,
    updateUser,
    changeUserAuth,
    getUserList,
    getUserInfo,
    changePw
}