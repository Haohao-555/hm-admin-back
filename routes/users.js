const router = require('koa-router')()
const loginCheck = require('../middleware/loginCheck')
const { searchUser, changeUserInfo, getUserInfo, changePw } = require('../controller/users/index')
// 管理员和普通用户共有的接口
router.prefix('/adminApi/user')

// *登录
router.post('/login', async (ctx, next) => {
    const { account = '-', password = '-' } = ctx.request.body
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
    if (!data.state) {
        ctx.body = {
            errorno: 4007,
            message: '账号已被禁用'
        }
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
    const result = await searchUser({ where: { account } })
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

})

// *上传头像
router.post('/uploadava', async(ctx, next) => {})

module.exports = router
