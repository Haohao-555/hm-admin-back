const router = require('koa-router')()
const loginCheck = require('../middleware/loginCheck')
const { getArticlesList, createArticles, getArticlesDetail, updateArticles } = require('../controller/articles/index')
// 文章接口
router.prefix('/adminApi/article');


// 获取文章列表
router.get('/list', loginCheck, (ctx, next) => {

})

// 创建文章
router.post('/create', loginCheck, (ctx, next) => {

})

// 获取文章内容
router.get('/content', loginCheck, (ctx, next) => {

})

// 更新文章
router.post('/update', loginCheck, (ctx, next) => {

})

module.exports = router
