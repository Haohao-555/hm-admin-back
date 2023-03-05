/**
 * @description 时间相关的工具函数
 * @author 浩
 */

 const { format } = require('date-fns')

 /**
  * 格式化日期
  * @param {String} str 时间字符串
  * @returns 
  */
 function timeFormat (str) {
     return format(new Date(str), 'yyyy.MM.dd HH:mm') 
 }
 
 module.exports = {
     timeFormat
 }