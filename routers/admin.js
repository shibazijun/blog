// 第一步 引入框架
var express= require('express');// 加载express模块

var router= express.Router()
var User=require('../models/User')
var Category=require('../models/category')  //引入模型

router.use(function (req,res,next) {
    if(!req.userInfo.isAdmin){
        //非管理员用户
        res.send("只有管理员才可以管理");
        return;
    }
    next()
})


//首页监听访问请求
router.get('/',function(req,res,next){
    //res.send('管理员')
    res.render('admin/index',{
        userInfo:req.userInfo
    })
})




//用户管理
router.get('/user',function(req,res,next){

    //limit(number) 限制每页获取的条数
    // skip() 跳过多少条

    // 分页公式:   (当前页 - 1) * limit

    //从数据库读取数据，分配给模板
    var page  = Number(req.query.page  || 1 )  //当前在第几页位置
    var limit = 10  //每页多少条
    var pages = 0     //总页数

    User.count().then(function (count) {  //数据库中有多少记录
        //console.log(count)
        pages= Math.ceil(count / limit)  //计算总页数
        page = Math.min(page,pages)      //取值不能大于总页数
        page = Math.max(page,1)       //取值不能小于1

        var skip  = ( page - 1 ) * limit  //当前在第几页位置


        User.find().limit(limit).skip(skip).then(function (users) {
            //console.log(users)
            res.render('admin/user_index',{
                userInfo:req.userInfo,
                users:users,
                count:count, //总条数
                pages:pages, //总页数
                limit:limit, //每页条数
                page:page,   //当前第几页
            })
        })


    })
})



//分类首页
router.get('/category',function(req,res,next){
   /* res.render('admin/category_index',{
        userInfo:req.userInfo,
    })*/

    //limit(number) 限制每页获取的条数
    // skip() 跳过多少条

    // 分页公式:   (当前页 - 1) * limit

    //从数据库读取数据，分配给模板
    var page  = Number(req.query.page  || 1 )  //当前在第几页位置
    var limit = 10  //每页多少条
    var pages = 0     //总页数

    Category.count().then(function (count) {  //数据库中有多少记录
        //console.log(count)
        pages= Math.ceil(count / limit)  //计算总页数
        page = Math.min(page,pages)      //取值不能大于总页数
        page = Math.max(page,1)       //取值不能小于1

        var skip  = ( page - 1 ) * limit  //当前在第几页位置
        Category.find().limit(limit).skip(skip).then(function (categories) {
            //console.log(users)
            res.render('admin/category_index',{
                userInfo:req.userInfo,
                categories:categories,
                count:count, //总条数
                pages:pages, //总页数
                limit:limit, //每页条数
                page:page,   //当前第几页
            })
        })
    })



})



//增加分类 渲染增加页面
router.get('/category/add',function(req,res,next){
    res.render('admin/category_add',{
        userInfo:req.userInfo,
    })
})

//分类保存
router.post('/category/add',function(req,res,next){
    //console.log(req.body)
    var name=req.body.name || '';
    //判断是否为空
    if(name==""){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:"名称不能为空"
        })
        return //Promise.reject()
    }

    // 查数据库不能重复分类名
    Category.findOne({
        name:name
    }).then(function (rs) {
        if(rs){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:"分类名称已经存在",
            })
            return Promise.reject()
        }else{
            //数据库中不存在可以保存分类名称
            return new Category({
                name:name
            }).save()
        }
    }).then(function (newCategory) {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:"分类名称保存成功",
            url:'/admin/category'
        })
    })
})


// 修改分类
router.get('/category/edit',function (req,res) {
    var id= req.query.id || '';
    Category.findOne({
        _id:id
    }).then(function (category) {
        if(!category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:"分类名称不存在",
            });
            return Promise.reject()
        }else{
            res.render('admin/category_edit',{
                userInfo:req.userInfo,
                category:category
            });
        }
    })
})


// 分类修改保存
router.post('/category/edit',function (req,res) {
    var id = req.query.id || "";
    var name= req.body.name || ""

    Category.findOne({
        _id:id
    }).then(function (category) {
        if(!category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:"分类名称不存在",
            });
            return Promise.reject()
        }else{
            if(name == category.name){
                //如果没有做任何修改
                res.render('admin/success',{
                    userInfo:req.userInfo,
                    message:"修改成功",
                    url:'/admin/category'
                });
                return Promise.reject()
            }else{
                //修改的分类名称是否在数据库中存在
                return Category.findOne({
                    _id:{$ne:id},
                    name:name
                })
            }
        }
    }).then(function (sameCategory) {
        if(sameCategory){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:"数据库中存在同名分类名称",
            });
            return Promise.reject()
        }else{
          return Category.update({
                _id:id //修改的条件
            },{
                name:name  //修改的值
            })
        }
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:"修改成功",
            url:'/admin/category'
        });
    })
})

// 删除分类
router.get('/category/delete',function (req,res,next) {
    var id = req.query.id || "";
    Category.remove({
        _id:id
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:"删除成功",
            url:'/admin/category'
        });
    })

})



module.exports = router;  //把router暴露出去