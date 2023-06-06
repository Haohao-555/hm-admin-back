const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const {REDIS_CONF} = require('./config/db')

const users = require('./routes/users')
const admin = require('./routes/admin')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())


// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

//session 与  redis
app.keys = ['dfhQWE_123#ewr']
app.use(session({
  key: 'hmAdmin.sid', //cookie name 默认是 `koa.sid`
  prefix: 'hmAdmin:sess:', // redis key 的前缀，默认是 `koa:sess:`
  //配置cookie
  cookie:{
    path:"/",
    httpOnly:true,
    maxAge:24 * 60 * 60 * 1000 // 1 day
  },
  //配置redis
  store: redisStore({
    all:`${REDIS_CONF.host}:${REDIS_CONF.port}`
  })
}))

// routes
app.use(users.routes(), users.allowedMethods())
app.use(admin.routes(), admin.allowedMethods())


// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
