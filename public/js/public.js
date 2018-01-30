var limit=5;
var page=1;
var pages=0;
var comments=[];

$(function () {
    var $loginBox=$("#loginBox");
    var $registerBox=$("#registerBox");
    var $userInfo=$("#userInfo");

    $loginBox.find("a.colMint").on("click",function () {
        $registerBox.show()
        $loginBox.hide()
    })

    $registerBox.find("a.colMint").on("click",function () {
        $registerBox.hide()
        $loginBox.show()
    })

    //注册
    $registerBox.find("button").on("click",function () {
        //通过ajax提交请求
        $.ajax({
            type:'post',
            url:'/api/user/register',
            data:{
              username:  $registerBox.find('[name="username"]').val(),
              password:  $registerBox.find('[name="password"]').val(),
              repassword:  $registerBox.find('[name="repassword"]').val()
            },
            dataType:'json',
            success:function(result){
                $registerBox.find(".colWarning").html(result.message);

                if(!result.code){
                    setTimeout(function () {
                        $registerBox.hide()
                        $loginBox.show()
                    },1000)
                }
            }
        })
    })




    //登录
    $loginBox.find("button").on("click",function () {
        //通过ajax提交请求
        $.ajax({
            type:'post',
            url:'/api/user/login',
            data:{
                username:  $loginBox.find('[name="username"]').val(),
                password:  $loginBox.find('[name="password"]').val()
            },
            dataType:'json',
            success:function(result){
                $loginBox.find(".colWarning").html(result.message);
                if(!result.code){
                    window.location.reload()
                }
            }
        })
    })
    
    $("#logoutBtn").on("click",function () {
        $.ajax({
            url:'/api/user/logout',
            success:function (result) {
                if(!result.code){
                    window.location.reload()
                }
            }
            
        })
    })

    $("#submit").on("click",function () {

        $.ajax({
            url:'/api/comment/post',
            data:{
                contentid:$("#contentId").val(),
                content:$("#messageContent").val()
            },
            type:"POST",
            success:function (responseData) {
                comments=responseData.data.comments.reverse()
                renderComment()
                $("#messageContent").val('')
            }
        })
    })



    // 每次重载是获取说有评论
    $.ajax({
        url:'/api/comment',
        data:{
            contentid:$("#contentId").val(),
        },
        success:function (responseData) {
            comments=responseData.data.reverse()
            renderComment()
        }

    })
})



function  renderComment(){


    $("#messageCount").html(comments.length);

    pages=Math.max(Math.ceil(comments.length / limit),1);
    var start= Math.max(0,(page - 1 ) * limit);
    var end=Math.min(start + limit,comments.length);

    var $lis=$("ul.pager>li");

    $lis.eq(1).html(page+"/"+ pages)

    if( page <= 1){
        page=1;
        $lis.eq(0).html("没有上一页了")
    }else{
        $lis.eq(0).html("<a href='javascript:;'>上一页</a>")
    }

    if( page >= pages){
        page=pages;
        $lis.eq(2).html("没有下一页了")
    }else{
        $lis.eq(2).html("<a href='javascript:;'>下一页</a>")
    }

    var html='';
    if(comments.length==0){
        html='<div class="messageBox"><p>还没有留言</p></div>'
    }else{
        for(var i=start ;i<end;i++){
            html+='<div class="messageBox">\n' +
                '<p><span>'+ comments[i].username +'</span> <span>'+ formatData(comments[i].postTime) +'</span></p>\n' +
                '<p>'+ comments[i].content +'</p>'
        }
    }
    $(".messageList").html(html)
}

function formatData(d) {
    var dt=new Date(d)
    return dt.getFullYear()+'-'+ (dt.getMonth()+1)+'-'+ dt.getDate() +" " + dt.getHours() + ":"+ dt.getMinutes() +":"+ dt.getSeconds()
}
$(function () {
    $("ul.pager").unbind("click","a").on("click","a",function () {
       if($(this).parent().is(".previous")){
           page--
       }else if($(this).parent().is(".next")){
           page++
       }
        renderComment();

    })
})

