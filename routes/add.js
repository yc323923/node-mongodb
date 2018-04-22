var express = require('express');
var router = express.Router();
// 引入封装好的加密方法
const md5 = require("../crypto/md5.js");
// 引入验证插件
const validator = require("validator");
// 添加用户接口
router.post('/', function(req, res, next) {
     const {set,db,info} = req;
     const {users,email,phone,password,sex,adress} = req.body;
     var err = {};
    if(!users){ //判断用户名是否为空  
        err.users="用户名不能为空"
    };
    if(!email){//判断邮箱是否为空
        err.email="邮箱不能为空"
    };
    if(!phone){//判断电话号码是否为空  
        err.phone="电话号码不能为空"
    };
    if(!password){//判断密码是否为空  
        err.password="密码不能为空"
    }else{
        if(password.length<6){
            err.password="设置的密码不能少于六位"
        };
    }
    if(JSON.stringify(err)=="{}"){
         req.body.password = md5(password);//给密码加密处理
         db.collection("users").find({email:email},function(err,docs){//在数据库中搜索邮箱是否已经存在
             if(docs.length==0){//邮箱不存在的情况
                 db.collection("users").find({phone:phone},function(err,docs){//在数据库中搜索电话号码是否存在
                     if(docs.length==0){ //手机号码不存在的情况
                           db.collection("users").insert(req.body,function(err,result){//符合要求可以添加数据
                               var ops = result.ops[0];
                               set(res);
                               res.end(
                                JSON.stringify(
                                    info("添加成功",1,null,ops)
                                   )
                               )
                           })
                     }else{//否则手机号码存在的情况
                         set(res);
                        res.end(
                            JSON.stringify(
                                info("添加失败",0,["phone","该手机号码已经存在了"],null)
                               )
                        )
                     }
                 })
             }else{//否则邮箱存在的情况
                 set(res)
                 res.end(
                     JSON.stringify(
                         info("添加失败",0,["email","该邮箱已经存在了"],null)
                        )
                 )
             }
         })
    }else{ //当用户名或密码或邮箱或手机号码至少有一个没填时
        set(res)
        res.end(
            JSON.stringify(
                info("添加失败",0,err,null)
            )
        );
    }
});

module.exports = router;
