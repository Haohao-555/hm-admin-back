const { getUserInfo } = require('../controller/users')
// 登录验证
module.exports = async (ctx, next) => {
    // TODO：判断用户是否已经登录
    if (ctx.session.userInfo) {
        const userInfo = await getUserInfo({ id: ctx.session.userInfo.id })
        if (userInfo.id !== ctx.session.userInfo.id) {
            ctx.body = {
                errorno: 6000,
                message: '用户信息被删除了'
            }
            return
        }
        await next()
        return
    } else {
        ctx.body = {
            errorno: 4000,
            message: '用户未登录'
        }
    }
}
