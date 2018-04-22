var express = require('express');
var router = express.Router();
// 引入封装好的加密方法
const md5 = require("../crypto/md5.js");
// 引入验证插件
const validator = require("validator");
/*登录接口*/
router.post('/', function(req, res, next) {
  var {set,db,info} = req;
  var errs = {};
  var {account,password} = req.body;
  if(!account){//判断账户是否为空
      errs.account="账号不能为空";
  }
  if(!password){// 判断密码是否为空
      errs.password="密码不能为空";
  }
  if(JSON.stringify(errs)=="{}"){//当账户和密码不为空时
    /**
     * check 判断是否登录成功
     * @param {array} result 查询结果
     */
      function check(result){
          console.log(result)
           if(result.length>0){
               if(password == result[0].password){ //判断传来的密码是否和数据库中的密码匹配
                  set(res);
                   res.end(
                    JSON.stringify(
                      info("登录成功",1,null,{account})
                      )
                   )
               }else{  //当密码不匹配的时候
                   set(res);
                   res.end(
                    JSON.stringify(
                      info("登录失败",0,["password","密码错误"],null)
                      )
                   )
               }
           }else{ //当在数据库中没查到内容的时候
               set(res);
               res.end(
                JSON.stringify(
                  info("登录失败",0,["account","账户填写错误"],null)
                  )
               )
           }
      }
       password = md5(password);
       if(validator.isEmail(account)){ //如果是邮箱
          db.collection("users").find({email:account},function(err,docs){
              check(docs)
          })
       }else if(validator.isMobilePhone(account,"zh-CN")){ //如果是手机号码
           db.collection("users").find({phone:account},function(err,docs){
               check(docs)
           })
       }else{//是用户
           db.collection("users").find({users:account},function(err,docs){
               check(docs)
           })
       }
  }else{//当手机号或者密码至少有一个没填的时候
      set(res)
      res.end(
          JSON.stringify(
              info("登录失败",0,errs,null)
            )
    )
  }
});

module.exports = router;