const { SUPPER_ADMID, ADMIN, USER } = require('../config/auth')
const checkAuth = (auth) => {
    if (auth == SUPPER_ADMID || auth == ADMIN || auth == USER) return true
    return false
}

module.exports = {
    checkAuth
}