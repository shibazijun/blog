// 第一步 引入框架
var express= require('express');// 加载express模块
var router= express.Router()
var Category=require('../models/category')  //引入模型



//监听访问请求
router.get('/',function(req,res,next){
    //res.send('首页')
    //console.log(req.userInfo)

    //读取分类信息
    Category.find().then(function(categories){
        //第一个参数为模板，第二个参数传递给模板的数据

        //console.log(categories)
        res.render('main/index',{
            userInfo:req.userInfo,
            categories:categories
        })
    })



})


module.exports = router;  //把router暴露出去