// 参数配置


//获取环境参数  package.json dev
const env = process.env.NODE_ENV

let MYSQL_CONF = {
        host: '你的地址',//本地地址
        user: '',//用户名
        password: '',//密码
        port: 3306,//端口号
        database: 'hm_admin_back'//数据库名称
 };
 let REDIS_CONF = {
        port: 6379,
        host: 'http://127.0.0.1'
 }


module.exports = {
    MYSQL_CONF,
    REDIS_CONF
}

