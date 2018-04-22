var express = require('express');
var router = express.Router();
// 获取数据的接口
router.get('/', function(req, res, next) {
 var {set,db,query,info} = req;
 console.log(query);
 if(Object.keys(query).length!="2"){//判断查询条件是否符合要求
   set(res)
   res.send(
     JSON.stringify(
       info("查询失败",0,["err","查询条件必须是limit和page"],null)
     )
   )
   
 }else{//如果符合要求,将传递来的数据转换为数字类型
  if(Number(query.limit)<=0){//判断limit的数据不能小于等于0
    set(res)
    res.send(
      JSON.stringify(
        info("查询失败",0,["err","limit的参数要大于0"],null)
      )
    )
  }else{
    var page = Number(query.page);
    console.log(page)
    var limit =Number(query.limit);
    if(page%1===0&&limit%1===0){
             //  在数据库中获取数据
    db.collection("users").find({},{limit:limit,skip:page},function(err,result){
      if(result.length>0){ // 如果查到数据
           set(res)
           res.end(
             JSON.stringify(
               info("查询成功",1,null,result)
             )
           )
         }else{ //没查到数据 
           set(res)
           res.end(
             JSON.stringify(
               info("查询失败",0,["err","没有查到数据"],null)
               )
           )
         }
      })
    }else{
      set(res)
      res.send(
        JSON.stringify(
          info("查询失败",0,["err","必须传入参数,并且传入的参数必须是整数"],null)
        )
      )
    }

  }

 }

});
module.exports = router;
