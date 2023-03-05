const Sequeline = require('sequelize')
const { MYSQL_CONF } = require('../config/db')
const { host, user, password, database, port, dialect } = MYSQL_CONF;

const conf = {
  host,
  dialect,
  pool: {
    max:5,
    min:0,
    idle:10000
  }
}
module.exports = new Sequeline(database, user, password, conf)