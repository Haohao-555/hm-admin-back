const { ADMIN, USER } = require('../config/auth')
const checkAuth = (auth) => {
    if (auth == ADMIN || auth == USER) return true
    return false
}

module.exports = {
    checkAuth
}