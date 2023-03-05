// 执行同步操作

const seq = require('./seq')
const { initAuthData, initUsersData } = require('./initData/index')
// 加载所有模型
require('./module/index')

// 连接测试
seq.authenticate().then(() => {
  console.log('连接成功')
}).catch(() => {
  console.log('连接失败')
})

// 执行同步 （将表中进行重置）
seq.sync({ force: true }).then(async() => {
  // 初始化 auths 表数据
  await initAuthData()
  // 初始化 users 表数据
  await initUsersData()
  process.exit()
})