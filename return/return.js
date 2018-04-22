/**
 * info 返回给用户数据的方法
 * @param {String} mes 提示信息
 * @param {Number} sta 状态码0或1
 * @param {String} err 错误信息
 * @param {Object} dat 数据
 */
function info(mes,sta,err,dat){
    // 判断传进来的实参是不是数组
    if(err instanceof Array ){
        var obj = {};
        obj[err[0]]=err[1];
        err = obj;
    }
    var obj = {
        message:mes,
        status:sta,
        error:err,
        data:dat
    }
    return obj;
}
module.exports = function(req,res,next){
    req.info=info;
    next();
}