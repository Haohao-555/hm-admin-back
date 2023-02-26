
// 登录验证

const { ErrorModel } = require('../model/resModel')
module.exports = async (ctx, next) => {
   
    // TODO：判断用户是否已经登录
    console.log(ctx.session, '验证')
    if (ctx.session.userInfo) {
        await next()
        return
    }
    const res = new ErrorModel('尚未登陆')
    res.errno = 4001
    ctx.body = res
}
