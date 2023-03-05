const router = require('koa-router')()
const loginCheck = require('../middleware/loginCheck')
const Mock = require('mockjs')
const { SUPPER_ADMID, ADMIN, USER } = require('../config/auth')
const { checkAuth } = require('../util/checkAuth')
const { searchUser, addUser, getUserList, changeUserInfo, changeUserAuth, getUserInfo, changePw } = require('../controller/users/index')
// *用户接口
router.prefix('/adminApi/user')

// *登录
router.post('/login', async (ctx, next) => {
    const { account = '-', password = '-' } = ctx.request.body;
    const data = await searchUser({ where: { account, password } })
    if (data.account == account) {
        // TODO 将账号信息（id）保存到 session 中
        ctx.session.userInfo = data
        ctx.body = {
            errorno: 0,
            message: '登录成功'
        }
        return
    }
    ctx.body = {
        errorno: 4001,
        message: '账号或密码错误'
    }
})

// *退出登录
router.post('/logout', loginCheck, async (ctx, next) => {
    // TODO: 删除 session 会话
    delete ctx.session.userInfo
    ctx.body = {
        errorno: 0,
        message: '退出登录成功'
    }
})

// *注册
router.post('/register', loginCheck, async (ctx, next) => {
    const { account = '-', password = '123' } = ctx.request.body
    const result = await searchUser({ where: { account } });
    if (result.account == account) {
        ctx.body = {
            errorno: 4002,
            message: '账号必须唯一'
        }
        return
    } else {
        const Random = Mock.Random
        const firstName = Random.cfirst()
        const userList = [{
            account: account,
            password: password,
            nickName: firstName + Random.clast(),
            authId: '0',
            gender: '3',
            age: 18,
            idcard: Random.id(),
            city: Random.city(true),
            email: Random.email(),
            state: true,
            avatar: Random.image('60x60', '#de4307', '#ffffff', firstName),
            intriduce: Random.csentence(12, 18)
        }];
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
});

// *查看用户列表
router.get('/list', loginCheck, async (ctx, next) => {
    const { pageSize = 5, pageIndex = 0, where = {} } = ctx.query
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
});

// *修改个人信息
router.post('/updatePrivateInfo', loginCheck, async (ctx, next) => {
    const { nickName = '', gender = '3', age = 18, idcard = '', city = '', email = '', intriduce = '' } = ctx.request.body
    // TODO 获取 session 中的账号（id）
    const accountId = ctx.session.userInfo.id
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

    // TODO: 获取最新用户信息（更新到 session 中）
    const newUserInfo = await searchUser({ where: { id: accountId } })
    ctx.session.userInfo = newUserInfo

    ctx.body = {
        errorno: 0,
        message: '更新用户信息成功',
        data: newUserInfo
    }
})

// *修改用户身份
router.post('/changeAuth', loginCheck, async (ctx, next) => {

    // TODO 获取 session 中的 权限 ID（auth）及 账号 ID （id）
    const authId = ctx.session.userInfo.authId
    const sessionAccountId = ctx.session.userInfo.id

    if (authId == SUPPER_ADMID) { // !当前请求身份为 超级管理员 （可以对他人权限进行修改）
        let { accountId, authId = '0' } = ctx.request.body

        if (accountId == sessionAccountId) { // !被修改身份为 超级管理员
            ctx.body = {
                errorno: 5001,
                message: '超级管理员不能修改自己的权限'
            }
            return
        } else { // !被修改的身份为 管理员 或 普通用户
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
                const message = `${SUPPER_ADMID}:超级管理员; ${ADMIN}:普通管理员; ${USER}:普通用户`
                ctx.body = {
                    errorno: 5003,
                    message: `修改权限身份值不正确 (${message})`
                }
            }
        }
    } else { // !当前请求身份 非超级管理员
        ctx.body = {
            errorno: 5004,
            message: '只有超级管理员才能修改权限'
        }
    }
})

// *修改密码
router.post('/changePw', loginCheck, async (ctx, next) => {
    const { oldpw, newpw } = ctx.request.body
    // TODO: 获取 session 中账号 ID
    const id = ctx.session.userInfo.id

    const result = await changePw({
        whereUserList: [
            {
                data: { password: newpw },
                where: { id: id, password: oldpw }
            }
        ]
    })

    if (!result.flag) {
        ctx.body = {
            errorno: 4005,
            message: '修改密码失败'
        }
        return
    }

    ctx.body = {
        errorno: 0,
        message: '修改密码成功'
    }

    // !注意：这里并没有把新的密码同步到 session 中（session 并没有保存账号密码）
})

// *判断账号是否唯一
router.get('/accountIsUnique', async (ctx, next) => {
    const { account } = ctx.query
    const result = await searchUser({ where: { account } });
    if (result.account != account) {
        ctx.body = {
            errorno: 4006,
            message: '账号重复',
            data: {
                state: true
            }
        }
    }
    ctx.body = {
        errorno: 0,
        message: '账号唯一',
        data: {
            state: false
        }
    }
})

// *判断用户是否登录
router.post('/isLogin', async (ctx, next) => {
    // TODO 判断 session 是否存在
    if (ctx.session.userInfo) {
        // TODO 通过 session 中 accountId 去返回用户信息
        const userInfo = await getUserInfo({ id: ctx.session.userInfo.id })
        // TODO 判断一下数据库中的用户信息是否已经过期（被删除）
        if (userInfo.id != ctx.session.userInfo.id) {
            delete ctx.session.userInfo
            ctx.body = {
                errorno: 6000,
                message: '用户信息被删除了'
            }
            return
        }

        ctx.body = {
            errorno: 0,
            message: '用户已登录',
            data: {
                state: true,
                userInfo
            }
        }
    } else {
        ctx.body = {
            errorno: 4000,
            message: '用户未登录'
        }
    }

});

module.exports = router
