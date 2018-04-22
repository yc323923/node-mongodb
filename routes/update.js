var express = require('express');
var router = express.Router();

// 修改数据接口
router.post('/', function(req, res, next) {
  const {set,info,db} = req;
  var {users,phone,email,data} = req.body;
// 创建一个条件对象,将满足的条件放在里面
  var query = {};
//讲json格式的字符串转化为对象
if(data){
    data = JSON.parse(data);
    if(users){// 如果users是更新条件
        query.users=users
    };
    if(email){// 如果email是更新条件
    query.email=email
    };
    if(phone){// 如果phone是更新条件
    query.phone = phone;
    }
    if(JSON.stringify(query)=="{}"){// 如果没有传条件的话就报错，并且告诉用户需要传入条件
    set(res)
    res.send(
        JSON.stringify(info("更新失败",0,["err","请传入更新的条件"],null))
    )
    }else{
    if(typeof data =="object"){
    db.collection("users").update(query,data,function(err,result){ // 将条件以及更新的数据传入
    if(result.n=="1"&&result.nModified=="1"){//当更新了数据的时候
        set(res)
        res.end(
            JSON.stringify(
                info("更新成功",1,null,result)
                )
        )
    }else{  //当没更新数据的时候
        // console.log(result)
        set(res)
        res.end(
            JSON.stringify(
                info("更新失败",0,["err","不能匹配到数据"],result)
                )
        )
    }
    
    })
    }else{
       set(res)
       res.end(
           JSON.stringify(
               info("更新失败",0,["err","更新的内容必须是json格式"],null)
           )
       )
    }
    
    }
}else{
    set(res)
    res.end(
        JSON.stringify(
            info("更新失败",0,["err","请传入更新内容"],null)
            )
    )
}
});
module.exports = router;