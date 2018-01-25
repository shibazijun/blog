// 第一步 引入框架
var express= require('express');// 加载express模块

var router= express.Router()
//监听访问请求
router.get('/',function(req,res,next){
    //res.send('首页')
    console.log(req.userInfo._id)
    //第一个参数为模板，第二个参
    res.render('main/index',{
        userInfo:req.userInfo
    })
})


module.exports = router;  //把router暴露出去