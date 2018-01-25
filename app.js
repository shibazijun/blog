// 应用程序的入口


var express= require('express');// 加载express模块
var swig= require('swig');      //加载模板
var app=express();              // 创建app应用=> Nodejs HeateServer()

//静态文件处理， 设置静态文件托管目录
//当用户访问的URL以public开始的，则返回对应的__dirname + public 下的文件
app.use('/public',express.static(__dirname + '/public'));

// 配置应用模板
//定义当前应用所使用的模板引擎
app.engine('html',swig.renderFile);
// 第一个参数：模板引擎的名称，同时也是模板文件的后缀
// 第二个参数：表示用于解析处理模板内容的方法


app.set('views','./views'); //设置模板存放的目录，第一个参数必须是views，第二个参数是目录
app.set('view engine','html'); //注册模板引擎，第一个参数必须是view engine，第二个参数和app.engine这个方法中的第个参数必须是一致的

swig.setDefaults({cache:false});   //开发过程中关闭缓存

// 动态文件处理，请求首页
// req request对象
// res response 对象
// next 函数
app.get("/",function(req,res,next){
    // res.send('<h1>hello word</h1>')
    // 读取views目录下指定的文件，解解析并返回给客户端
    // 第一个参数：表示模板的文件，相对于views目录
    // 第二个参数：传递给模板使用的数据
    res.render('index')
})


//路由
/*app.get("/main.css",function(req,res,next){
   res.setHeader('content-type','text/css');
    res.send('body{background:red}');
})*/




// 监听http请求
app.listen(8088);

// 用户发送http请求-> URL->  解析路由->  找到匹配的规则 -> 执行指定绑定的函数，返回对应的内容给客户端
// public -> 静态 -> 直接读取指定目录下的文件 -> 返回给客户端
// 动态 ->  处理业务逻辑，加载模板，解析模板 -> 返回数据给客户端