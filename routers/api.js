// 第一步 引入框架
var express= require('express');// 加载express模块

var router= express.Router();
var User= require("../models/User") //引入user模型
var Content= require("../models/Content") //引入Content模型


/*//监听访问请求
// 用户注册
1、用户名不能为空
2、密码不能为空
3、两次密码必须一致

1、用户是否已经被注册
查询数据库

*/

//统一返回格式
var responseData;
router.use(function(req,res,next){
    responseData={
        code:0,
        message:''
    }
    next()
})

//注册路由
router.post('/user/register',function(req,res,next){
    //res.send('api-user')
    var username  = req.body.username;
    var password  = req.body.password;
    var repassword= req.body.repassword;

    if(username==''){
        responseData.code=1;
        responseData.message='用户名不能为空';
        res.json(responseData); //把错误信息返回给前端
        return;
    }

    if(password==''){
        responseData.code=2;
        responseData.message='密码不能为空';
        res.json(responseData); //把错误信息返回给前端
        return;
    }

    if(password!=repassword){
        responseData.code=3;
        responseData.message='两次输入的密码不一致';
        res.json(responseData); //把错误信息返回给前端
        return;
    }
	
	
	//用户是否已经被注册，数据库验证
    User.findOne ({
        username:username
    }).then(function (userinfo) {
        console.log(userinfo)
        if(userinfo){
            responseData.code=4;
            responseData.message='用户已注册';
            res.json(responseData); //把错误信息返回给前端
            return;
        }
        //保存用户信息
        var user=new User({
            username:username,
            password:password
        });
        return user.save(); //把插入的信息传递给下一个then方法
    }).then(function (newUserInfo) {
        console.log(newUserInfo)
        responseData.message='注册成功';
        res.json(responseData);
    })

})

//登录路由
router.post('/user/login',function(req,res) {
    var username = req.body.username;
    var password = req.body.password;

    if(username==''||password==''){
        responseData.code=1;
        responseData.message='用户或密码不能为空';
        res.json(responseData); //把错误信息返回给前端
        return;
    }

    //查询数据库中的用户名和密码是否一致
    User.findOne ({
        username: username,
        password:password
    }).then(function (userinfo) {
        if(!userinfo) {
            responseData.code = 2;
            responseData.message = '用户或密码错误';
            res.json(responseData); //把错误信息返回给前端
            return;
        }else{
            responseData.message='登录成功';
            responseData.userInfo={
                _id:userinfo._id,
                username:userinfo.username
            };
            req.cookies.set('userInfo',JSON.stringify({  //保存为字符串
                _id:userinfo._id,
                username:userinfo.username
            }))
            res.json(responseData);
            return;
        }
    })
})

// 退出路由
router.get('/user/logout',function(req,res) {
    req.cookies.set('userInfo',null);
    responseData.message = '退出成功';
    res.json(responseData);
})

router.get('/comment',function (req,res) {
    var contentId=req.query.contentid || '';

    Content.findOne({
        _id:contentId
    }).then(function (content) {
        console.log(content)
        responseData.data=content.comments;
        res.json(responseData);
    })
})

// 评论提交
router.post('/comment/post',function (req,res) {
    var contentId=req.body.contentid || '';
    var postData = {
        username:req.userInfo.username,
        postTime:new Date(),
        content:req.body.content
    }

    console.log(contentId)
    console.log(postData)

    Content.findOne({
        _id:contentId
    }).then(function (content) {
        content.comments.push(postData)
        return content.save()
    }).then(function (newConetnt) {
        responseData.message="评论成功"
        responseData.data=newConetnt;
        res.json(responseData);
    })

})





module.exports = router;  //把router暴露出去