/**
 * 这是一个设置后台返回给前端数据类型的方法
 * @param {object} 响应的数据 
 */
function set(res){ // 设置数据类型为json格式
     res.setHeader("content-type","application/json,charset=utf-8");
     res.type("json")
}
module.exports=function(){
      return function(req,res,next){
          req.set = set
          next()
      }
}