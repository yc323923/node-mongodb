// 引入加密模块
const crypto = require("crypto");
/**
 * md5 加密方法
 * @param {string} pas 密码 
 */
function md5(pas){
     return crypto.createHash("md5").update(pas).digest("hex")
}
module.exports = md5;