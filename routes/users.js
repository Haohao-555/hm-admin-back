const router = require('koa-router')()
const loginCheck = require('../middleware/loginCheck')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { SUPPER_ADMID } = require('../config/auth')
const { checkAuth } = require('../util/checkAuth')
const { findUser, addUser, getUserList, updateUser, changeUserAuth, findAccount, getUserInfo, changePw } = require('../controller/users/index')
// 用户接口
router.prefix('/adminapi/user')

// 登录
router.post('/login', async (ctx, next) => {
    const { account, password } = ctx.request.body;
    const data = await findUser({ account, password })
    if (data.account) {

        // TODO 将账号信息（id）保存到 session 中
        ctx.session.userInfo = {
            id: data.id,
            account: data.account,
            password: data.password,
            auth: data.auth
        }
        console.log('登录成功', ctx.session.useInfo)
        ctx.body = new SuccessModel(data)
        return
    }
    ctx.body = new ErrorModel('账号或密码错误')
})

// 退出登录
router.post('/logout', loginCheck, async (ctx, next) => {
    // TODO: 删除 session 会话
    delete ctx.session.userInfo
    ctx.body = new SuccessModel({ logout: true })
})

// 注册
router.post('/register', async (ctx, next) => {
    const auth = '0';
    let { account, password, introduce = '', name } = ctx.request.body
    name = name || account

    const isFind = await findAccount({ account });
    if (isFind) {
        ctx.body = new ErrorModel('账号必须唯一');
        return
    } else {
        const flag = await addUser({ account, password, introduce, name, auth });
        if (!flag) {
            ctx.body = new ErrorModel('注册失败');
            return
        } else {
            ctx.body = new SuccessModel({ account, password, introduce, name, auth });
        }
    }
});

// 查看用户列表
router.get('/list', loginCheck, async (ctx, next) => {
    const userList = await getUserList()
    ctx.body = new SuccessModel(userList)
});

// 修改个人信息
router.post('/updatePrivateInfo', loginCheck, async (ctx, next) => {
    // TODO 获取 session 中的账号（id）
    const accountId = ctx.session.userInfo.id
    const account = ctx.session.userInfo.account

    let { introduce = '', name = '' } = ctx.request.body
    const flag = await updateUser({ accountId, introduce, name, account })

    if (flag) {
        ctx.body = new SuccessModel({ account, introduce, name })
    } else {
        ctx.body = new ErrorModel('修改个人信息失败');
    }
})

// 修改用户权限
router.post('/changeAuth', loginCheck, async (ctx, next) => {
    // TODO 获取 session 中的权限 id
    const auth = ctx.session.userInfo.auth
    const sessionAccountId = ctx.session.userInfo.id;

    if (auth == SUPPER_ADMID) {

        let { accountId, auth = '0' } = ctx.request.body;

        if (accountId == sessionAccountId) {

            ctx.body = new ErrorModel('超级管理员不能修改自己的权限');

        } else {
            if (checkAuth(auth)) {
                auth += '';
                const flag = await changeUserAuth({ accountId, auth })
                if (flag) {
                    ctx.body = new SuccessModel({ accountId, auth })
                } else {
                    ctx.body = new ErrorModel('修改权限失败');
                }
            } else {
                ctx.body = new ErrorModel('修改权限身份值不正确');
            }
        }

    } else {
        ctx.body = new ErrorModel('只有超级管理员才能修改权限');
    }
})

// 修改密码
router.post('/changePw', loginCheck, async (ctx, next) => {
    const { oldpw, newpw } = ctx.request.body
    const account = ctx.session.userInfo.account
    const id = ctx.session.userInfo.id
    const flag = await changePw({ oldpw, newpw, id, account })
    if (flag) {
        ctx.body = new SuccessModel({ changePw: true })
    } else {
        ctx.body = new ErrorModel('修改密码失败')
    }
})

// 判断账号是否唯一
router.get('/accountIsUnique', async (ctx, next) => {
    const { account } = ctx.query
    const isFind = await findAccount({ account })
    ctx.body = new SuccessModel({ isFind });
})

// 判断用户是否登录
router.post('/isLogin', async (ctx, next) => {
    // TODO 判断 session 是否存在
    if (ctx.session.userInfo) {
        // TODO 通过 session 中 accountId 去返回用户信息
        const userInfo = await getUserInfo({ id: ctx.session.userInfo.id })
        ctx.body = new SuccessModel(Object.assign({ isLogin: true }, { userInfo }))
    } else {
        ctx.body = new SuccessModel({ isLogin: false })
    }

});

module.exports = router
