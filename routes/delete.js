var express = require('express');
var router = express.Router();
// 删除用户接口
router.post('/', function(req, res, next) {
  const {set,db,info} = req;
  var {users,phone,email} = req.body;
  var query = {};// 存放查询的条件
  if(users){// 判断用户名是否填写
      query.users = users;
  }
  if(phone){// 判断电话号码是否填写
    query.phone = phone;
  }
  if(email){// 判断邮箱是否填写
    query.email = email;
  }
  if(JSON.stringify(query)=="{}"){//判断有没有传入条件,如果没传入
    set(res)
    res.send(
      JSON.stringify(
        info("删除失败",0,["err","没有填写删除条件"],null)
      )
    )
  }else{//如果传入条件
        db.collection("users").remove(query,function(err,result){
        var data = result[1].result;
        if(data.n=="1"){//如果匹配到数据
          set(res)
          res.send(
            JSON.stringify(
              info("删除成功",1,null,data)
              )
          )
        }else{//如果没匹配到数据
          set(res)
          res.send(
            JSON.stringify(
              info("删除失败",0,["err","没有匹配到数据"],null)
              )
          )
        }
    })
  }
 
});

module.exports = router;
