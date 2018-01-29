// 第一步 引入框架
var express= require('express');// 加载express模块
var router= express.Router()
var Category=require('../models/category')  //引入模型
var Content=require('../models/Content')  //引入模型

var data;

// 处理通用的数据
router.use(function (req,res,next) {
    data={
        userInfo : req.userInfo,
        categories : [],
    }

    Category.find().then(function(categories){
        data.categories = categories;  //读取分类信息
        next();
    })

})


//首页
router.get('/',function(req,res,next){
    //res.send('首页')
    //console.log(req.userInfo);

    data.category= req.query.category || ''
    data.count   = 0
    data.page    = Number(req.query.page  || 1 )  //当前在第几页位置
    data.limit   = 10  //每页多少条
    data.pages   = 0    //总页数


    var where={}
    if(data.category){
        where.category = data.category
    }
    //读取分类信息
    Content.where(where).count().then(function (count) {
        data.count=count
        data.pages= Math.ceil(data.count / data.limit)  //计算总页数
        data.page = Math.min(data.page,data.pages)      //取值不能大于总页数
        data.page = Math.max(data.page,1)       //取值不能小于1
        var skip  = ( data.page - 1 ) * data.limit  //当前在第几页位置

        return Content.where(where).find().sort({_id:-1}).limit(data.limit).skip(skip).populate(["category",'user']).sort({addTime:-1});

    }).then(function (contents) {
        data.contents=contents;
        //第一个参数为模板，第二个参数传递给模板的数据
        res.render('main/index',data)
    })
})


//详情内容  
router.get('/view',function (req,res) {
    var contentid = req.query.contentid || "";
    Content.findOne({
        _id:contentid
    }).then(function (content) {
        data.content=content;
        content.views++;
        content.save()
        //console.log(content)
        res.render('main/view',data);
    })

});





module.exports = router;  //把router暴露出去