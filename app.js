var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// 引入封装好的设置返回给前端的数据信息方法
var setHeader = require("./setHeader/set.js");
// 引入封装的返回信息方法
var info = require("./return/return.js");
// 引入封装好的mongodb的方法
const database = require('express4-mongo');
// 引入index路由
var getRouter = require('./routes/get');
// 引入users路由
var deleteRouter = require('./routes/delete.js');
// 引入login路由
var loginRouter = require("./routes/login");
// 引入register路由
var registerRouter = require("./routes/register");
// 引入add路由
var addRouter = require("./routes/add");
// 引入update路由
var updateRouter = require("./routes/update");
var app = express();
// 使用中间件绑定setHeader方法
app.use(setHeader())
// 使用中间件绑定mongodb的方法，并且连接到指定的数据库
app.use(database({
  database: "lemon", //数据库名称
  host:"mongodb://localhost:27017" //你的mongodb地址
}))
// 使用中间件给req上面添加一个返回信息的方法
app.use(info);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// 设置跨域请求问题
app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin","*"),
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next()
})
app.use(express.static(path.join(__dirname, 'public')));
app.use('/get', getRouter);
app.use('/delete', deleteRouter);
app.use("/login",loginRouter);
app.use("/register",registerRouter);
app.use("/add",addRouter);
app.use("/update",updateRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
console.log("服务器启动")