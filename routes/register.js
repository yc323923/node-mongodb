var express = require('express');
var router = express.Router();
// 引入封装好的加密方法
const md5 = require("../crypto/md5.js");
// 引入验证插件
const validator = require("validator");
/*注册接口*/
router.post('/', function(req, res, next) {
    const {set,db,info} = req;
    var {users,email,phone,password} = req.body;
    console.log(password)
  var errs = {};// 收集错误信息
    if(!users){ // 验证用户名
        errs.users="账号不能为空";
    }
    if(!validator.isEmail(String(email))){ // 验证邮箱
        errs.email="邮箱错误";
    }
    if(!validator.isMobilePhone(String(phone),"zh-CN")){// 验证手机号码
        errs.phone="手机号码错误";
    }
    if(!password){// 验证密码
        errs.password="密码不能为空";
    }
    if(JSON.stringify(errs)=="{}"){// 当所有选项填写时
        req.body.password = md5(req.body.password); 
        db.collection("users").find({users:users},function(err,docs){// 查询users是否存在
            if(docs.length==0){
                db.collection("users").find({phone:phone},function(err,docs){ // 查询电话号码是否存在
                    if(docs.length==0){
                        db.collection("users").find({email:email},function(err,docs){// 查询电子邮箱是否存在
                            if(docs.length==0){
                                db.collection("users").insert(req.body,function(err,result){//插入数据
                                    console.log(result.result)
                                    set(res)
                                    res.end(
                                        JSON.stringify(
                                            info("注册成功",1,null,req.body)
                                        )
                                    )
                                })
                            }else{ // 邮箱被注册的情况
                                set(res)
                                res.end(
                                    JSON.stringify(
                                    info("注册失败",0,["email","邮箱已经被注册"],null)
                                    )
                                )
                            }
                        })
                    }else{// 电话号码被注册的情况
                        set(res)
                        res.end(
                            JSON.stringify(
                            info("注册失败",0,["phone","电话号码已经被注册"],null)
                            )
                        )
                    }
                })
            }else{// 用户名被注册的情况
                set(res)
                res.end(
                    JSON.stringify(
                    info("注册失败",0,["users","用户名已经被注册"],null)
                    )
                )
            }
        })
    }else{ //当用户名或密码或邮箱或手机号码至少有一个没填时
        set(res)
        res.end(
            JSON.stringify(
                info("注册失败",0,errs,null)
              )
        )
    }
});

module.exports = router;
