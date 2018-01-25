// 第一步 引入框架
var express= require('express');// 加载express模块

var router= express.Router()
//监听访问请求
router.get('/user',function(req,res,next){
    res.send('user')
})


module.exports = router;  //把router暴露出去