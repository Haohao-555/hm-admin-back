<<<<<<< HEAD
# 通用后台管理系统（后端）

## 项目介绍 **📖**

* 技术栈 **Node** + **Koa2** + **Mysql** + **Session** + **Redis** + **Sequelize** ，
* MVC 的开发模式。路由层、控制层、服务层
* 使用 Session + redis 实现用户信息通讯、加密及保存

> 前端项目可以查看我另外一个仓库 [https://github.com/Haohao-555/qz-admin](https://github.com/Haohao-555/qz-admin)

## 接口 **🔨**

* - [x] 用户模块
  * - [x] 登录
  * - [x] 退出登录
  * - [x] 注册
  * - [x] 查看用户列表
  * - [x] 修改个人信息
  * - [x] 修改用户身份
  * - [x] 修改密码
  * - [x] 判断账号是否唯一
  * - [x] 判断用户是否登录
* [ ] 文件上传模块（头像）

目前数据都是真实成数据库中取出，部分数据使用 Mockjs 进行模拟生成（头像）

## 项目搭建  **📔**

### 下载

```text
git clone https://github.com/Haohao-555/qz-admin-back
```

### 安装插件

```text
npm install
```

### 数据库 和 redis  配置

* config/db.js

```text
let MYSQL_CONF = { // mysql 配置
    host: '',//本地地址
    user: '',//用户名
    password: '',//密码
    port: 3306,//端口号
    database: 'hm_admin_back_Test',//数据库名称
    dialect: 'mysql'
};
let REDIS_CONF = { // redis 配置
    port: 6379,
    host: 'http://127.0.0.1'
}
```

> 并且在数据库中初始化好数据库

* 同步数据

```text
node /db/sysnc.js
```

### 启动项目

```text
npm run dev
```

### 生产环境

```text
npm run prd
```

> 需在本地全局安装 pm2

## 总结 💥

该项目主要是服务于我的另外一个[开源项目](https://github.com/Haohao-555/qz-admin)，为其提供接口服务。但这个项目对于入门 Koa2 如何写好接口有比较大的提升，上手也不是很难。

<br/>

最后，希望大家不要嫌弃，一分耕耘一分收获

待完善。。。。
=======
# qz-admin-back
权限后台管理系统后台服务
>>>>>>> d42000c36e827080b366a3a22a9b4432870f5836
