// 超级管理员权限 id
const SUPPER_ADMID = '2'

// 普通管理员权限 id
const ADMIN = '1'

// 普通用户权限 id
const USER = '0'

const SUPPER_ADMID_PERMISSION = [
    "usermanage",
    "userrole",
    "tabletree",
    "tablehook",
    "componentguide",
    "componenticon",
    "componenteditor",
    "componentmarkdown",
    "chartline"
]

const ADMIN_PERMISSION = [
    "usermanage",
    "userrole",
    "tabletree",
    "componentguide",
    "componenticon",
    "componenteditor",
    "componentmarkdown",
    "tablehook"
]

const USER_PERMISSION = [
    "tabletree",
    "tablehook",
    "componentguide",
    "componenticon",
    "componenteditor",
    "componentmarkdown",
    "chartline"
]

module.exports = {
    SUPPER_ADMID,
    SUPPER_ADMID_PERMISSION,
    ADMIN,
    ADMIN_PERMISSION,
    USER,
    USER_PERMISSION
}